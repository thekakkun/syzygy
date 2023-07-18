use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use slvs::{
    constraint::{PointsCoincident, SomeConstraintHandle},
    entity::{ArcOfCircle, Circle, Cubic, EntityHandle, LineSegment, Point, SomeEntityHandle},
    group::Group,
};
use tauri::State;

use crate::{Canvas, Drawing};

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Via {
    Close,
    End,
    Move,
    Through(SomeEntityHandle),
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub struct Segment {
    from: SomeEntityHandle,
    via: Via,
}

#[tauri::command]
pub fn get_objects(sys_state: State<Drawing>, canvas_state: State<Canvas>) -> Vec<Group> {
    let sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;
    let canvas_group = sys.entity_data(&canvas).unwrap().group;

    sys.groups()
        .iter()
        .filter(|&group| *group != canvas_group)
        .copied()
        .collect()
}

// Current assumptions
// - An object consists of a single path or loop
//   (no deletions of segments, leading to discontinuous paths)
// - The path starts from the oldest point in the group
//   (Segments aren't added to the path after creation)
// - If there's a circle in the group, that's the only object.
#[tauri::command]
pub fn get_object(handle: Group, sys_state: State<Drawing>) -> Vec<Segment> {
    let sys = sys_state.0.lock().unwrap();

    let mut point_to_entity = HashMap::new();
    let mut other_entity_point = HashMap::new();
    for handle in sys.entity_handles(Some(&handle), None) {
        if let Some(circle_segment) = match handle {
            SomeEntityHandle::ArcOfCircle(_) => {
                let arc_data = sys
                    .entity_data::<ArcOfCircle>(&handle.try_into().unwrap())
                    .unwrap();

                point_to_entity.insert(arc_data.arc_start, handle);
                other_entity_point.insert((handle, arc_data.arc_start), arc_data.arc_end);
                point_to_entity.insert(arc_data.arc_end, handle);
                other_entity_point.insert((handle, arc_data.arc_end), arc_data.arc_start);

                None
            }
            SomeEntityHandle::Circle(_) => {
                let circle_data = sys
                    .entity_data::<Circle>(&handle.try_into().unwrap())
                    .unwrap();

                Some(vec![Segment {
                    from: circle_data.center.into(),
                    via: Via::Through(handle),
                }])
            }
            SomeEntityHandle::Cubic(_) => {
                let cubic_data = sys
                    .entity_data::<Cubic>(&handle.try_into().unwrap())
                    .unwrap();

                point_to_entity.insert(cubic_data.start_point, handle);
                other_entity_point.insert((handle, cubic_data.start_point), cubic_data.end_point);
                point_to_entity.insert(cubic_data.end_point, handle);
                other_entity_point.insert((handle, cubic_data.end_point), cubic_data.start_point);

                None
            }
            SomeEntityHandle::LineSegment(_) => {
                let line_data = sys
                    .entity_data::<LineSegment>(&handle.try_into().unwrap())
                    .unwrap();

                point_to_entity.insert(line_data.point_a, handle);
                other_entity_point.insert((handle, line_data.point_a), line_data.point_b);
                point_to_entity.insert(line_data.point_b, handle);
                other_entity_point.insert((handle, line_data.point_b), line_data.point_a);

                None
            }
            _ => None,
        } {
            return circle_segment;
        };
    }

    let mut point_to_point = HashMap::new();
    sys.constraint_handles(Some(&handle), None)
        .iter()
        .filter_map(|&handle| match handle {
            SomeConstraintHandle::PointsCoincident(_) => Some(
                sys.constraint_data::<PointsCoincident>(&handle.try_into().unwrap())
                    .unwrap(),
            ),
            _ => None,
        })
        .for_each(|coincidence_data| {
            point_to_point.insert(coincidence_data.point_a, coincidence_data.point_b);
            point_to_point.insert(coincidence_data.point_b, coincidence_data.point_a);
        });

    let mut object = Vec::new();

    let mut next_point = sys
        .entity_handles(Some(&handle), None)
        .iter()
        .find_map(|handle| {
            if let Ok(point_handle) = EntityHandle::<Point>::try_from(*handle) {
                if point_to_entity.get(&point_handle).is_some() {
                    Some(point_handle)
                } else {
                    None
                }
            } else {
                None
            }
        });

    while let Some(segment_start) = next_point {
        if let Some(&entity) = point_to_entity.get(&segment_start) {
            object.push(Segment {
                from: segment_start.into(),
                via: Via::Through(entity),
            });

            let segment_end = other_entity_point.get(&(entity, segment_start)).unwrap();

            match point_to_point.get(segment_end) {
                // End of segment is coincident to a point that is...
                Some(point) => {
                    // Already in the current object (path is a closed loop)
                    if object.iter().any(|segment| segment.from == (*point).into()) {
                        object.push(Segment {
                            from: (*segment_end).into(),
                            via: Via::Close,
                        });
                        break;
                        // A new point (continue down path)
                    } else {
                        next_point = Some(*point)
                    }
                }
                // End of segment is not coincident with anything (end of path)
                None => {
                    object.push(Segment {
                        from: (*segment_end).into(),
                        via: Via::End,
                    });
                    break;
                }
            }
        }
    }

    object
}
