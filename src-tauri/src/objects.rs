use crate::{entities::PointData, Canvas, Drawing};
use serde::{Deserialize, Serialize};
use slvs::{
    constraint::{PointsCoincident, SomeConstraintHandle},
    entity::{ArcOfCircle, Circle, Cubic, EntityHandle, LineSegment, Point, SomeEntityHandle},
    group::Group,
    utils::{angle_2d, distance},
    System,
};
use std::collections::HashMap;
use std::sync::MutexGuard;
use tauri::State;

#[tauri::command]
pub fn objects(sys_state: State<Drawing>, canvas_state: State<Canvas>) -> Vec<Group> {
    let sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;
    let canvas_group = sys.entity_data(&canvas).unwrap().group;

    sys.groups()
        .iter()
        .filter(|&group| *group != canvas_group)
        .copied()
        .collect()
}

#[tauri::command]
pub fn object(handle: Group, sys_state: State<Drawing>) -> Result<Object, &'static str> {
    sys_state.object(handle)
}

#[tauri::command]
pub fn path(handle: Group, sys_state: State<Drawing>) -> Result<PathData, &'static str> {
    let object = sys_state.object(handle)?;
    let sys = sys_state.0.lock().unwrap();

    match object {
        Object::Path { segments } => {
            let path: Result<Vec<_>, _> = segments
                .iter()
                .map(|segment| segment.as_path(&sys))
                .collect();
            Ok(PathData::Path { segments: path? })
        }
        Object::Shape { segments } => {
            let path: Result<Vec<_>, _> = segments
                .iter()
                .map(|segment| segment.as_path(&sys))
                .collect();
            Ok(PathData::Shape { segments: path? })
        }
        Object::Circle { .. } => Err("Expected object to be a path or shape"),
    }
}

impl Drawing {
    pub fn object(&self, handle: Group) -> Result<Object, &'static str> {
        let sys = self.0.lock().unwrap();

        let handles = sys.entity_handles(Some(&handle), None);

        let mut point_to_segment = HashMap::new();
        for handle in handles {
            if let Ok(handle) = EntityHandle::<ArcOfCircle>::try_from(handle) {
                let data = sys.entity_data(&handle)?;

                let start = PointData::from_sys(&sys, &data.arc_start)?;
                let end = PointData::from_sys(&sys, &data.arc_end)?;

                point_to_segment.insert(
                    data.arc_start,
                    Segment {
                        from: start,
                        via: handle.into(),
                        to: end,
                    },
                );
                point_to_segment.insert(
                    data.arc_end,
                    Segment {
                        from: end,
                        via: handle.into(),
                        to: start,
                    },
                );
            } else if let Ok(handle) = EntityHandle::<Circle>::try_from(handle) {
                return Ok(Object::Circle {
                    handle: handle.into(),
                });
            } else if let Ok(handle) = EntityHandle::<Cubic>::try_from(handle) {
                let data = sys.entity_data(&handle)?;

                let start_point = PointData::from_sys(&sys, &data.start_point)?;
                let end_point = PointData::from_sys(&sys, &data.end_point)?;

                point_to_segment.insert(
                    data.start_point,
                    Segment {
                        from: start_point,
                        via: handle.into(),
                        to: end_point,
                    },
                );
                point_to_segment.insert(
                    data.end_point,
                    Segment {
                        from: end_point,
                        via: handle.into(),
                        to: start_point,
                    },
                );
            } else if let Ok(handle) = EntityHandle::<LineSegment>::try_from(handle) {
                let data = sys.entity_data(&handle)?;

                let point_a = PointData::from_sys(&sys, &data.point_a)?;
                let point_b = PointData::from_sys(&sys, &data.point_b)?;

                point_to_segment.insert(
                    data.point_a,
                    Segment {
                        from: point_a,
                        via: handle.into(),
                        to: point_b,
                    },
                );
                point_to_segment.insert(
                    data.point_b,
                    Segment {
                        from: point_b,
                        via: handle.into(),
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
                if let Ok(point_handle) = EntityHandle::<Point>::try_from(*handle) {
                    if point_to_segment.get(&point_handle).is_some() {
                        Some(point_handle)
                    } else {
                        None
                    }
                } else {
                    None
                }
            });

        // Walk through Point -> Segment -> Point until it loops or path ends
        let mut segments = Vec::new();
        while let Some(segment_start) = next_point {
            if let Some(&segment) = point_to_segment.get(&segment_start) {
                segments.push(segment);

                let segment_end: EntityHandle<Point> = segment.to.handle.try_into()?;

                match point_to_point.get(&segment_end) {
                    Some(point) => {
                        if segments
                            .iter()
                            .any(|segment| segment.from.handle == (*point).into())
                        {
                            return Ok(Object::Shape { segments });
                        } else {
                            next_point = Some(*point)
                        }
                    }
                    None => return Ok(Object::Path { segments }),
                }
            }
        }

        Ok(Object::Path { segments })
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Object {
    Circle { handle: SomeEntityHandle },
    Path { segments: Vec<Segment> },
    Shape { segments: Vec<Segment> },
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub struct Segment {
    from: PointData,
    via: SomeEntityHandle,
    to: PointData,
}

impl Segment {
    pub fn as_path(&self, sys: &MutexGuard<'_, System>) -> Result<String, &'static str> {
        let mut path = format!("M {}, {}", self.from.coords[0], self.from.coords[1]);

        if let Ok(handle) = EntityHandle::<ArcOfCircle>::try_from(self.via) {
            let data = sys.entity_data(&handle)?;

            if let (
                Point::OnWorkplane {
                    coords: center_coords,
                    ..
                },
                Point::OnWorkplane {
                    coords: arc_start_coords,
                    ..
                },
                Point::OnWorkplane {
                    coords: arc_end_coords,
                    ..
                },
            ) = (
                sys.entity_data(&data.center)?,
                sys.entity_data(&data.arc_start)?,
                sys.entity_data(&data.arc_end)?,
            ) {
                let radius = distance(center_coords, arc_start_coords);
                let angle = angle_2d(
                    [center_coords, arc_start_coords],
                    [center_coords, arc_end_coords],
                );

                if self.from.handle == data.arc_start.into() {
                    path.push_str(
                        format!(
                            "A, {}, {}, {}, 0, {}, {}",
                            radius,
                            radius,
                            if angle < 180.0 { 0 } else { 1 },
                            arc_end_coords[0],
                            arc_end_coords[1]
                        )
                        .as_str(),
                    )
                } else {
                    path.push_str(
                        format!(
                            "A, {}, {}, {}, 1, {}, {}",
                            radius,
                            radius,
                            if angle < 180.0 { 0 } else { 1 },
                            arc_start_coords[0],
                            arc_start_coords[1]
                        )
                        .as_str(),
                    )
                }
            }
        } else if let Ok(handle) = EntityHandle::<Cubic>::try_from(self.via) {
            let data = sys.entity_data(&handle)?;

            if let (
                Point::OnWorkplane {
                    coords: start_point_coords,
                    ..
                },
                Point::OnWorkplane {
                    coords: start_control_coords,
                    ..
                },
                Point::OnWorkplane {
                    coords: end_control_coords,
                    ..
                },
                Point::OnWorkplane {
                    coords: end_point_coords,
                    ..
                },
            ) = (
                sys.entity_data(&data.start_point)?,
                sys.entity_data(&data.start_control)?,
                sys.entity_data(&data.end_control)?,
                sys.entity_data(&data.end_point)?,
            ) {
                if self.from.handle == data.start_point.into() {
                    path.push_str(
                        format!(
                            "C {}, {}, {}, {}, {}, {}",
                            start_control_coords[0],
                            start_control_coords[1],
                            end_control_coords[0],
                            end_control_coords[1],
                            end_point_coords[0],
                            end_point_coords[1]
                        )
                        .as_str(),
                    )
                } else {
                    path.push_str(
                        format!(
                            "C {}, {}, {}, {}, {}, {}",
                            end_control_coords[0],
                            end_control_coords[1],
                            start_control_coords[0],
                            start_control_coords[1],
                            start_point_coords[0],
                            start_point_coords[1]
                        )
                        .as_str(),
                    )
                }
            }
        } else if EntityHandle::<LineSegment>::try_from(self.via).is_ok() {
            path.push_str(format!("L {}, {}", self.to.coords[0], self.to.coords[1]).as_str());
        }

        Ok(path)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum PathData {
    Path { segments: Vec<String> },
    Shape { segments: Vec<String> },
}

// Current assumptions
// - An object consists of a single path or loop
//   (no deletions of segments, leading to discontinuous paths)
// - The path starts from the oldest point in the group
//   (Segments aren't added to the path after creation)
// - If there's a circle in the group, that's the only object.

// #[derive(Copy, Clone, Debug, Serialize, Deserialize)]
// #[serde(tag = "type")]
// pub enum Via {
//     Move,
//     ArcOfCircle {
//         radius: f64,
//         angle: f64,
//         direction: Direction,
//     },
//     Cubic {
//         from_control: PointData,
//         to_control: PointData,
//     },
//     LineSegment,
// }

// #[derive(Copy, Clone, Debug, Serialize, Deserialize)]
// pub enum Direction {
//     Clockwise,
//     CounterClockwise,
// }

// #[tauri::command]
// pub fn object(handle: Group, sys_state: State<Drawing>) -> Object {
//     let sys = sys_state.0.lock().unwrap();

//     // Point to the segment it starts
//     let mut segment_map = HashMap::new();
//     for handle in sys.entity_handles(Some(&handle), None) {
//         if let Ok(handle) = EntityHandle::<ArcOfCircle>::try_from(handle) {
//             let data = sys.entity_data(&handle).unwrap();

//             let center =
//                 PointData::from_slvs(&data.center, &sys.entity_data(&data.center).unwrap())
//                     .unwrap();
//             let start =
//                 PointData::from_slvs(&data.arc_start, &sys.entity_data(&data.arc_start).unwrap())
//                     .unwrap();
//             let end = PointData::from_slvs(&data.arc_end, &sys.entity_data(&data.arc_end).unwrap())
//                 .unwrap();

//             let radius = distance(center.coords, start.coords);
//             let angle = angle_2d([center.coords, start.coords], [center.coords, end.coords]);

//             segment_map.insert(
//                 data.arc_start,
//                 Segment {
//                     from: start,
//                     via: Via::ArcOfCircle {
//                         radius,
//                         angle,
//                         direction: Direction::CounterClockwise,
//                     },
//                     to: end,
//                 },
//             );
//             segment_map.insert(
//                 data.arc_end,
//                 Segment {
//                     from: end,
//                     via: Via::ArcOfCircle {
//                         radius,
//                         angle,
//                         direction: Direction::Clockwise,
//                     },
//                     to: start,
//                 },
//             );
//         } else if let Ok(handle) = EntityHandle::<Circle>::try_from(handle) {
//             let data = sys.entity_data(&handle).unwrap();

//             let center =
//                 PointData::from_slvs(&data.center, &sys.entity_data(&data.center).unwrap())
//                     .unwrap();
//             let radius = sys.entity_data(&data.radius).unwrap().val;

//             return Object::Circle { center, radius };
//         } else if let Ok(handle) = EntityHandle::<Cubic>::try_from(handle) {
//             let data = sys.entity_data(&handle).unwrap();

//             let start_point = PointData::from_slvs(
//                 &data.start_point,
//                 &sys.entity_data(&data.start_point).unwrap(),
//             )
//             .unwrap();
//             let start_control = PointData::from_slvs(
//                 &data.start_control,
//                 &sys.entity_data(&data.start_control).unwrap(),
//             )
//             .unwrap();
//             let end_control = PointData::from_slvs(
//                 &data.end_control,
//                 &sys.entity_data(&data.end_control).unwrap(),
//             )
//             .unwrap();
//             let end_point =
//                 PointData::from_slvs(&data.end_point, &sys.entity_data(&data.end_point).unwrap())
//                     .unwrap();

//             segment_map.insert(
//                 data.start_point,
//                 Segment {
//                     from: start_point,
//                     via: Via::Cubic {
//                         from_control: start_control,
//                         to_control: end_control,
//                     },
//                     to: end_point,
//                 },
//             );
//             segment_map.insert(
//                 data.end_point,
//                 Segment {
//                     from: end_point,
//                     via: Via::Cubic {
//                         from_control: end_control,
//                         to_control: start_control,
//                     },
//                     to: start_point,
//                 },
//             );
//         } else if let Ok(handle) = EntityHandle::<LineSegment>::try_from(handle) {
//             let data = sys.entity_data(&handle).unwrap();

//             let point_a =
//                 PointData::from_slvs(&data.point_a, &sys.entity_data(&data.point_a).unwrap())
//                     .unwrap();
//             let point_b =
//                 PointData::from_slvs(&data.point_b, &sys.entity_data(&data.point_b).unwrap())
//                     .unwrap();

//             segment_map.insert(
//                 data.point_a,
//                 Segment {
//                     from: point_a,
//                     via: Via::LineSegment,
//                     to: point_b,
//                 },
//             );
//             segment_map.insert(
//                 data.point_b,
//                 Segment {
//                     from: point_b,
//                     via: Via::LineSegment,
//                     to: point_a,
//                 },
//             );
//         }
//     }

//     // points that are coincident with eachother
//     let mut point_to_point = HashMap::new();
//     sys.constraint_handles(Some(&handle), None)
//         .iter()
//         .filter_map(|&handle| match handle {
//             SomeConstraintHandle::PointsCoincident(_) => Some(
//                 sys.constraint_data::<PointsCoincident>(&handle.try_into().unwrap())
//                     .unwrap(),
//             ),
//             _ => None,
//         })
//         .for_each(|coincidence_data| {
//             point_to_point.insert(coincidence_data.point_a, coincidence_data.point_b);
//             point_to_point.insert(coincidence_data.point_b, coincidence_data.point_a);
//         });

//     let mut next_point = sys
//         .entity_handles(Some(&handle), None)
//         .iter()
//         .find_map(|handle| {
//             if let Ok(point_handle) = EntityHandle::<Point>::try_from(*handle) {
//                 if segment_map.get(&point_handle).is_some() {
//                     Some(point_handle)
//                 } else {
//                     None
//                 }
//             } else {
//                 None
//             }
//         });

//     let mut segments = Vec::new();

//     while let Some(segment_start) = next_point {
//         if let Some(&segment) = segment_map.get(&segment_start) {
//             segments.push(segment);

//             let segment_end: EntityHandle<Point> = segment.to.handle.try_into().unwrap();

//             match point_to_point.get(&segment_end) {
//                 Some(point) => {
//                     if segments
//                         .iter()
//                         .any(|segment| segment.from.handle == (*point).into())
//                     {
//                         return Object::Shape { segments };
//                     } else {
//                         next_point = Some(*point)
//                     }
//                 }
//                 None => return Object::Path { segments },
//             }
//         }
//     }

//     Object::Path { segments }

//     // while let Some(segment_start) = next_point {
//     //     if let Some(&entity) = point_to_entity.get(&segment_start) {
//     //         let segment_end = other_entity_point.get(&(entity, segment_start)).unwrap();

//     //         if let (Ok(start_point), Ok(end_point)) = (
//     //             sys.entity_data(&segment_start),
//     //             sys.entity_data(&segment_end),
//     //         ) {
//     //             segments.push(Segment {
//     //                 from: start_point.into(),
//     //                 via: Via::Move,
//     //                 to: end_point.into(),
//     //             });
//     //         }

//     //         match point_to_point.get(segment_end) {
//     //             // End of segment is coincident to a point that is...
//     //             Some(point) => {
//     //                 // Already in the current object (path is a closed loop)
//     //                 if segments
//     //                     .iter()
//     //                     .any(|segment| (*point).into() == segment.from)
//     //                 {
//     //                     return Object::Shape(segments);

//     //                 // A new point (continue down path)
//     //                 } else {
//     //                     next_point = Some(*point)
//     //                 }
//     //             }
//     //             // End of segment is not coincident with anything (end of path)
//     //             None => return Object::Path(segments),
//     //         }
//     //     }
//     // }
// }

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
