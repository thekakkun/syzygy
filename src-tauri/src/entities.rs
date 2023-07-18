use crate::Drawing;

use serde::{Deserialize, Serialize};
use slvs::{
    entity::{ArcOfCircle, Circle, Cubic, EntityHandle, LineSegment, Point, SomeEntityHandle},
    group::Group,
};
use tauri::State;

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
pub struct Coords([f64; 2]);

impl From<[f64; 2]> for Coords {
    fn from(value: [f64; 2]) -> Self {
        Self(value)
    }
}

impl From<Point> for Coords {
    fn from(value: Point) -> Self {
        match value {
            Point::OnWorkplane { coords, .. } => Self(coords),
            Point::In3d { coords, .. } => Self([coords[0], coords[1]]),
        }
    }
}

impl From<Coords> for [f64; 2] {
    fn from(value: Coords) -> Self {
        value.0
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum EntityData {
    ArcOfCircle {
        group: Group,
        center: SomeEntityHandle,
        start: SomeEntityHandle,
        end: SomeEntityHandle,
    },
    Circle {
        group: Group,
        center: SomeEntityHandle,
        radius: f64,
    },
    Cubic {
        group: Group,
        start_point: SomeEntityHandle,
        start_control: SomeEntityHandle,
        end_control: SomeEntityHandle,
        end_point: SomeEntityHandle,
    },
    LineSegment {
        group: Group,
        point_a: SomeEntityHandle,
        point_b: SomeEntityHandle,
    },
    Point {
        group: Group,
        coords: Coords,
    },
}

#[tauri::command]
pub fn get_entity(
    handle: SomeEntityHandle,
    sys_state: State<Drawing>,
) -> Result<EntityData, &'static str> {
    let sys = sys_state.0.lock().unwrap();

    match handle {
        SomeEntityHandle::ArcOfCircle(_) => {
            let handle: EntityHandle<ArcOfCircle> = handle.try_into().unwrap();
            let data = sys.entity_data(&handle)?;

            Ok(EntityData::ArcOfCircle {
                group: data.group,
                center: data.center.into(),
                start: data.arc_start.into(),
                end: data.arc_end.into(),
            })
        }
        SomeEntityHandle::Circle(_) => {
            let handle: EntityHandle<Circle> = handle.try_into().unwrap();
            let data = sys.entity_data(&handle)?;

            Ok(EntityData::Circle {
                group: data.group,
                center: data.center.into(),
                radius: sys.entity_data(&data.radius)?.val,
            })
        }
        SomeEntityHandle::Cubic(_) => {
            let handle: EntityHandle<Cubic> = handle.try_into().unwrap();
            let data = sys.entity_data(&handle)?;

            Ok(EntityData::Cubic {
                group: data.group,
                start_point: data.start_point.into(),
                start_control: data.start_control.into(),
                end_control: data.end_control.into(),
                end_point: data.end_point.into(),
            })
        }
        SomeEntityHandle::LineSegment(_) => {
            let handle: EntityHandle<LineSegment> = handle.try_into().unwrap();
            let data = sys.entity_data(&handle)?;

            Ok(EntityData::LineSegment {
                group: data.group,
                point_a: data.point_a.into(),
                point_b: data.point_b.into(),
            })
        }
        SomeEntityHandle::Point(_) => {
            let handle: EntityHandle<Point> = handle.try_into().unwrap();
            let data = sys.entity_data(&handle)?;

            if let Point::OnWorkplane { coords, group, .. } = data {
                Ok(EntityData::Point {
                    group,
                    coords: coords.into(),
                })
            } else {
                Err("Handle exists, but doesn't correspond to Syzygy entity.")
            }
        }
        SomeEntityHandle::Distance(_)
        | SomeEntityHandle::Normal(_)
        | SomeEntityHandle::Workplane(_) => {
            Err("Handle exists, but doesn't correspond to Syzygy entity.")
        }
    }
}

#[tauri::command]
pub fn coords(handle: SomeEntityHandle, sys_state: State<Drawing>) -> Result<Coords, &'static str> {
    let sys = sys_state.0.lock().unwrap();

    let point_handle: EntityHandle<Point> = handle.try_into()?;
    let point_data = sys.entity_data(&point_handle)?;

    Ok(point_data.into())
}

// #[tauri::command]
// pub fn get_entities(sys_state: State<Drawing>) -> HashMap<u32, EntityData> {
//     let sys = sys_state.0.lock().unwrap();

//     let mut entities = HashMap::new();

//     sys.entity_handles(None, None)
//         .iter()
//         .for_each(|&handle| match handle {
//             SomeEntityHandle::ArcOfCircle(h) => {
//                 let handle: EntityHandle<ArcOfCircle> = handle.try_into().unwrap();
//                 let data = sys.entity_data(&handle).unwrap();

//                 entities.insert(
//                     h,
//                     EntityData::ArcOfCircle {
//                         group: data.group,
//                         center: sys.entity_data(&data.center).unwrap().into(),
//                         start: sys.entity_data(&data.arc_start).unwrap().into(),
//                         end: sys.entity_data(&data.arc_end).unwrap().into(),
//                     },
//                 );
//             }
//             SomeEntityHandle::Circle(h) => {
//                 let handle: EntityHandle<Circle> = handle.try_into().unwrap();
//                 let data = sys.entity_data(&handle).unwrap();

//                 entities.insert(
//                     h,
//                     EntityData::Circle {
//                         group: data.group,
//                         center: sys.entity_data(&data.center).unwrap().into(),
//                         radius: sys.entity_data(&data.radius).unwrap().val,
//                     },
//                 );
//             }
//             SomeEntityHandle::Cubic(h) => {
//                 let handle: EntityHandle<Cubic> = handle.try_into().unwrap();
//                 let data = sys.entity_data(&handle).unwrap();

//                 entities.insert(
//                     h,
//                     EntityData::Cubic {
//                         group: data.group,
//                         start_point: sys.entity_data(&data.start_point).unwrap().into(),
//                         start_control: sys.entity_data(&data.start_control).unwrap().into(),
//                         end_control: sys.entity_data(&data.end_control).unwrap().into(),
//                         end_point: sys.entity_data(&data.end_point).unwrap().into(),
//                     },
//                 );
//             }
//             SomeEntityHandle::LineSegment(h) => {
//                 let handle: EntityHandle<LineSegment> = handle.try_into().unwrap();
//                 let data = sys.entity_data(&handle).unwrap();

//                 entities.insert(
//                     h,
//                     EntityData::LineSegment {
//                         group: data.group,
//                         point_a: sys.entity_data(&data.point_a).unwrap().into(),
//                         point_b: sys.entity_data(&data.point_b).unwrap().into(),
//                     },
//                 );
//             }
//             SomeEntityHandle::Point(h) => {
//                 let handle: EntityHandle<Point> = handle.try_into().unwrap();
//                 let data = sys.entity_data(&handle).unwrap();

//                 if let Point::OnWorkplane { coords, group, .. } = data {
//                     entities.insert(
//                         h,
//                         EntityData::Point {
//                             group,
//                             coords: coords.into(),
//                         },
//                     );
//                 }
//             }
//             SomeEntityHandle::Distance(_)
//             | SomeEntityHandle::Normal(_)
//             | SomeEntityHandle::Workplane(_) => {}
//         });

//     entities
// }

// #[tauri::command]
// pub fn add_entity(
//     data: EntityData,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<SomeEntityHandle, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     match data {
//         EntityData::ArcOfCircle {
//             group,
//             center,
//             start,
//             end,
//         } => {
//             let center = sys.sketch(Point::new_on_workplane(group, canvas, center.into()))?;
//             let start = sys.sketch(Point::new_on_workplane(group, canvas, start.into()))?;
//             let end = sys.sketch(Point::new_on_workplane(group, canvas, end.into()))?;

//             let arc = sys.sketch(ArcOfCircle::new(group, canvas, center, start, end))?;
//             Ok(SomeEntityHandle::ArcOfCircle(arc.handle()))
//         }
//         EntityData::Circle {
//             group,
//             center,
//             radius,
//         } => {
//             let center = sys.sketch(Point::new_on_workplane(group, canvas, center.into()))?;
//             let radius = sys.sketch(Distance::new(group, radius))?;
//             let normal = sys.entity_data(&canvas)?.normal;

//             let circle = sys.sketch(Circle::new(group, normal, center, radius))?;
//             Ok(SomeEntityHandle::Circle(circle.handle()))
//         }
//         EntityData::Cubic {
//             group,
//             start_point,
//             start_control,
//             end_control,
//             end_point,
//         } => {
//             let start_point =
//                 sys.sketch(Point::new_on_workplane(group, canvas, start_point.into()))?;
//             let start_control =
//                 sys.sketch(Point::new_on_workplane(group, canvas, start_control.into()))?;
//             let end_control =
//                 sys.sketch(Point::new_on_workplane(group, canvas, end_control.into()))?;
//             let end_point = sys.sketch(Point::new_on_workplane(group, canvas, end_point.into()))?;

//             let cubic = sys.sketch(Cubic::new(
//                 group,
//                 start_point,
//                 start_control,
//                 end_control,
//                 end_point,
//             ))?;
//             Ok(SomeEntityHandle::Cubic(cubic.handle()))
//         }
//         EntityData::LineSegment {
//             group,
//             point_a,
//             point_b,
//         } => {
//             let point_a = sys.sketch(Point::new_on_workplane(group, canvas, point_a.into()))?;
//             let point_b = sys.sketch(Point::new_on_workplane(group, canvas, point_b.into()))?;

//             let line = sys.sketch(LineSegment::new(group, point_a, point_b))?;
//             Ok(SomeEntityHandle::LineSegment(line.handle()))
//         }
//         EntityData::Point { group, coords } => {
//             let point = sys.sketch(Point::new_on_workplane(group, canvas, coords.into()))?;
//             Ok(SomeEntityHandle::Point(point.handle()))
//         }
//     }
// }

// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// pub struct SyzygyArc {
//     group: Group,
//     center: Coords,
//     start: Coords,
//     end: Coords,
// }

// #[tauri::command]
// pub fn add_arc(
//     data: SyzygyArc,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<EntityHandle<ArcOfCircle>, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     let center = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.center.into(),
//     ))?;
//     let start = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.start.into(),
//     ))?;
//     let end = sys.sketch(Point::new_on_workplane(data.group, canvas, data.end.into()))?;

//     sys.sketch(ArcOfCircle::new(data.group, canvas, center, start, end))
// }

// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// pub struct SyzygyCircle {
//     group: Group,
//     center: Coords,
//     radius: f64,
// }

// #[tauri::command]
// pub fn add_circle(
//     data: SyzygyCircle,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<EntityHandle<Circle>, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     let center = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.center.into(),
//     ))?;
//     let radius = sys.sketch(Distance::new(data.group, data.radius))?;
//     let normal = sys.entity_data(&canvas)?.normal;

//     sys.sketch(Circle::new(data.group, normal, center, radius))
// }

// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// pub struct SyzygyCubic {
//     group: Group,
//     start_point: Coords,
//     start_control: Coords,
//     end_control: Coords,
//     end_point: Coords,
// }

// #[tauri::command]
// pub fn add_cubic(
//     data: SyzygyCubic,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<EntityHandle<Cubic>, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     let start_point = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.start_point.into(),
//     ))?;
//     let start_control = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.start_control.into(),
//     ))?;
//     let end_control = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.end_control.into(),
//     ))?;
//     let end_point = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.end_point.into(),
//     ))?;

//     sys.sketch(Cubic::new(
//         data.group,
//         start_point,
//         start_control,
//         end_control,
//         end_point,
//     ))
// }
// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// pub struct SyzygyLine {
//     group: Group,
//     point_a: Coords,
//     point_b: Coords,
// }

// #[tauri::command]
// pub fn add_line(
//     data: SyzygyLine,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<EntityHandle<LineSegment>, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     let point_a = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.point_a.into(),
//     ))?;
//     let point_b = sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.point_b.into(),
//     ))?;

//     sys.sketch(LineSegment::new(data.group, point_a, point_b))
// }

// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// pub struct SyzygyPoint {
//     group: Group,
//     coords: Coords,
// }

// #[tauri::command]
// pub fn add_point(
//     data: SyzygyPoint,
//     sys_state: State<Drawing>,
//     canvas_state: State<Canvas>,
// ) -> Result<EntityHandle<Point>, &'static str> {
//     let mut sys = sys_state.0.lock().unwrap();
//     let canvas = canvas_state.0;

//     sys.sketch(Point::new_on_workplane(
//         data.group,
//         canvas,
//         data.coords.into(),
//     ))
// }

// #[derive(Debug, Clone, Copy, Serialize, Deserialize)]
// #[serde(tag = "type")]
// pub enum SyzygyEntity {
//     Arc {
//         handle: EntityHandle<ArcOfCircle>,
//         data: SyzygyArc,
//     },
//     Circle {
//         handle: EntityHandle<Circle>,
//         data: SyzygyCircle,
//     },
//     Cubic {
//         handle: EntityHandle<Cubic>,
//         data: SyzygyCubic,
//     },
//     Line {
//         handle: EntityHandle<LineSegment>,
//         data: SyzygyLine,
//     },
//     Point {
//         handle: EntityHandle<Point>,
//         data: SyzygyPoint,
//     },
// }
