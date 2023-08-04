use std::collections::HashMap;

use crate::{entities::Point, Canvas, Drawing};
use serde::{Deserialize, Serialize};
use slvs::{
    constraint::{PointsCoincident, SomeConstraintHandle},
    entity::{ArcOfCircle, Circle, Cubic, EntityHandle, LineSegment, Point as SlvsPoint},
    group::Group,
    utils::{angle_2d, distance},
};
use tauri::State;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]

pub enum Object {
    Circle { center: Point, radius: f64 },
    Path { segments: Vec<Segment> },
    Shape { segments: Vec<Segment> },
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub struct Segment {
    from: Point,
    via: Via,
    to: Point,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Via {
    Move,
    ArcOfCircle {
        radius: f64,
        angle: f64,
        direction: Direction,
    },
    Cubic {
        from_control: Point,
        to_control: Point,
    },
    LineSegment,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub enum Direction {
    Clockwise,
    CounterClockwise,
}

// #[derive(Copy, Clone, Debug, Serialize, Deserialize)]
// #[serde(tag = "type")]
// pub enum To {
//     Close,
//     End,
//     Move {
//         point: SomeEntityHandle,
//     },
//     Draw {
//         point: SomeEntityHandle,
//         via: SomeEntityHandle,
//     },
// }

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
pub fn get_object(handle: Group, sys_state: State<Drawing>) -> Object {
    let sys = sys_state.0.lock().unwrap();

    // Point to the segment it starts
    let mut segment_map = HashMap::new();
    for handle in sys.entity_handles(Some(&handle), None) {
        if let Ok(handle) = EntityHandle::<ArcOfCircle>::try_from(handle) {
            let data = sys.entity_data(&handle).unwrap();

            let center =
                Point::from_slvs(&data.center, &sys.entity_data(&data.center).unwrap()).unwrap();
            let start =
                Point::from_slvs(&data.arc_start, &sys.entity_data(&data.arc_start).unwrap())
                    .unwrap();
            let end =
                Point::from_slvs(&data.arc_end, &sys.entity_data(&data.arc_end).unwrap()).unwrap();

            let radius = distance(center.coords, start.coords);
            let angle = angle_2d([center.coords, start.coords], [center.coords, end.coords]);

            segment_map.insert(
                data.arc_start,
                Segment {
                    from: start,
                    via: Via::ArcOfCircle {
                        radius,
                        angle,
                        direction: Direction::CounterClockwise,
                    },
                    to: end,
                },
            );
            segment_map.insert(
                data.arc_end,
                Segment {
                    from: end,
                    via: Via::ArcOfCircle {
                        radius,
                        angle,
                        direction: Direction::Clockwise,
                    },
                    to: start,
                },
            );
        } else if let Ok(handle) = EntityHandle::<Circle>::try_from(handle) {
            let data = sys.entity_data(&handle).unwrap();

            let center =
                Point::from_slvs(&data.center, &sys.entity_data(&data.center).unwrap()).unwrap();
            let radius = sys.entity_data(&data.radius).unwrap().val;

            return Object::Circle { center, radius };
        } else if let Ok(handle) = EntityHandle::<Cubic>::try_from(handle) {
            let data = sys.entity_data(&handle).unwrap();

            let start_point = Point::from_slvs(
                &data.start_point,
                &sys.entity_data(&data.start_point).unwrap(),
            )
            .unwrap();
            let start_control = Point::from_slvs(
                &data.start_control,
                &sys.entity_data(&data.start_control).unwrap(),
            )
            .unwrap();
            let end_control = Point::from_slvs(
                &data.end_control,
                &sys.entity_data(&data.end_control).unwrap(),
            )
            .unwrap();
            let end_point =
                Point::from_slvs(&data.end_point, &sys.entity_data(&data.end_point).unwrap())
                    .unwrap();

            segment_map.insert(
                data.start_point,
                Segment {
                    from: start_point,
                    via: Via::Cubic {
                        from_control: start_control,
                        to_control: end_control,
                    },
                    to: end_point,
                },
            );
            segment_map.insert(
                data.end_point,
                Segment {
                    from: end_point,
                    via: Via::Cubic {
                        from_control: end_control,
                        to_control: start_control,
                    },
                    to: start_point,
                },
            );
        } else if let Ok(handle) = EntityHandle::<LineSegment>::try_from(handle) {
            let data = sys.entity_data(&handle).unwrap();

            let point_a =
                Point::from_slvs(&data.point_a, &sys.entity_data(&data.point_a).unwrap()).unwrap();
            let point_b =
                Point::from_slvs(&data.point_b, &sys.entity_data(&data.point_b).unwrap()).unwrap();

            segment_map.insert(
                data.point_a,
                Segment {
                    from: point_a,
                    via: Via::LineSegment,
                    to: point_b,
                },
            );
            segment_map.insert(
                data.point_b,
                Segment {
                    from: point_b,
                    via: Via::LineSegment,
                    to: point_a,
                },
            );
        }
    }

    // points that are coincident with eachother
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

    let mut next_point = sys
        .entity_handles(Some(&handle), None)
        .iter()
        .find_map(|handle| {
            if let Ok(point_handle) = EntityHandle::<SlvsPoint>::try_from(*handle) {
                if segment_map.get(&point_handle).is_some() {
                    Some(point_handle)
                } else {
                    None
                }
            } else {
                None
            }
        });

    let mut segments = Vec::new();

    while let Some(segment_start) = next_point {
        if let Some(&segment) = segment_map.get(&segment_start) {
            segments.push(segment);

            let segment_end: EntityHandle<SlvsPoint> = segment.to.handle.try_into().unwrap();

            match point_to_point.get(&segment_end) {
                Some(point) => {
                    if segments
                        .iter()
                        .any(|segment| segment.from.handle == (*point).into())
                    {
                        return Object::Shape { segments };
                    } else {
                        next_point = Some(*point)
                    }
                }
                None => return Object::Path { segments },
            }
        }
    }

    Object::Path { segments }

    // while let Some(segment_start) = next_point {
    //     if let Some(&entity) = point_to_entity.get(&segment_start) {
    //         let segment_end = other_entity_point.get(&(entity, segment_start)).unwrap();

    //         if let (Ok(start_point), Ok(end_point)) = (
    //             sys.entity_data(&segment_start),
    //             sys.entity_data(&segment_end),
    //         ) {
    //             segments.push(Segment {
    //                 from: start_point.into(),
    //                 via: Via::Move,
    //                 to: end_point.into(),
    //             });
    //         }

    //         match point_to_point.get(segment_end) {
    //             // End of segment is coincident to a point that is...
    //             Some(point) => {
    //                 // Already in the current object (path is a closed loop)
    //                 if segments
    //                     .iter()
    //                     .any(|segment| (*point).into() == segment.from)
    //                 {
    //                     return Object::Shape(segments);

    //                 // A new point (continue down path)
    //                 } else {
    //                     next_point = Some(*point)
    //                 }
    //             }
    //             // End of segment is not coincident with anything (end of path)
    //             None => return Object::Path(segments),
    //         }
    //     }
    // }
}

// let mut point_to_entity = HashMap::new();
// let mut other_entity_point = HashMap::new();
// for handle in sys.entity_handles(Some(&handle), None) {
//     if let Some(circle_segment) = match handle {
//         SomeEntityHandle::ArcOfCircle(_) => {
//             let arc_data = sys
//                 .entity_data::<ArcOfCircle>(&handle.try_into().unwrap())
//                 .unwrap();

//             point_to_entity.insert(arc_data.arc_start, handle);
//             other_entity_point.insert((handle, arc_data.arc_start), arc_data.arc_end);
//             point_to_entity.insert(arc_data.arc_end, handle);
//             other_entity_point.insert((handle, arc_data.arc_end), arc_data.arc_start);

//             None
//         }
//         SomeEntityHandle::Circle(_) => {
//             let circle_data = sys
//                 .entity_data::<Circle>(&handle.try_into().unwrap())
//                 .unwrap();

//             if let (Ok(center_data), Ok(radius_data)) = (
//                 point(circle_data.center.into(), sys_state),
//                 sys.entity_data(&circle_data.radius),
//             ) {
//                 Some(Object::Circle {
//                     center: center_data,
//                     radius: radius_data.val,
//                 })
//             } else {
//                 None
//             }
//         }
//         SomeEntityHandle::Cubic(_) => {
//             let cubic_data = sys
//                 .entity_data::<Cubic>(&handle.try_into().unwrap())
//                 .unwrap();

//             point_to_entity.insert(cubic_data.start_point, handle);
//             other_entity_point.insert((handle, cubic_data.start_point), cubic_data.end_point);
//             point_to_entity.insert(cubic_data.end_point, handle);
//             other_entity_point.insert((handle, cubic_data.end_point), cubic_data.start_point);

//             None
//         }
//         SomeEntityHandle::LineSegment(_) => {
//             let line_data = sys
//                 .entity_data::<LineSegment>(&handle.try_into().unwrap())
//                 .unwrap();

//             point_to_entity.insert(line_data.point_a, handle);
//             other_entity_point.insert((handle, line_data.point_a), line_data.point_b);
//             point_to_entity.insert(line_data.point_b, handle);
//             other_entity_point.insert((handle, line_data.point_b), line_data.point_a);

//             None
//         }
//         _ => None,
//     } {
//         return circle_segment;
//     };
// }
