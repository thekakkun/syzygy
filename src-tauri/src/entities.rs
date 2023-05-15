use crate::{Canvas, Drawing};

use serde::{Deserialize, Serialize};
use slvs::{
    entity::{ArcOfCircle, Circle, Cubic, EntityHandle, LineSegment, Point, SomeEntityHandle},
    group::Group,
    target::OnWorkplane,
};
use tauri::State;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyArc {
    group: Group,
    center: OnWorkplane,
    begin: OnWorkplane,
    end: OnWorkplane,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCircle {
    group: Group,
    center: OnWorkplane,
    radius: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCubic {
    group: Group,
    start_point: OnWorkplane,
    start_control: OnWorkplane,
    end_control: OnWorkplane,
    end_point: OnWorkplane,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyPoint {
    group: Group,
    coords: OnWorkplane,
}

impl From<Point<OnWorkplane>> for SyzygyPoint {
    fn from(value: Point<OnWorkplane>) -> Self {
        Self {
            group: value.group,
            coords: value.coords,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyLine {
    group: Group,
    point_a: OnWorkplane,
    point_b: OnWorkplane,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SyzygyEntity {
    Arc {
        handle: EntityHandle<ArcOfCircle>,
        data: SyzygyArc,
    },
    Circle {
        handle: EntityHandle<Circle<OnWorkplane>>,
        data: SyzygyCircle,
    },
    Cubic {
        handle: EntityHandle<Cubic<OnWorkplane>>,
        data: SyzygyCubic,
    },
    Line {
        handle: EntityHandle<LineSegment<OnWorkplane>>,
        data: SyzygyLine,
    },
    Point {
        handle: EntityHandle<Point<OnWorkplane>>,
        data: SyzygyPoint,
    },
}

#[tauri::command]
pub fn get_entities(sys_state: State<Drawing>) -> Vec<SyzygyEntity> {
    let sys = sys_state.0.lock().unwrap();
    let handles = sys.entity_handles();

    handles
        .iter()
        .filter_map(|handle| match handle {
            SomeEntityHandle::ArcOfCircle(handle) => {
                let data = sys.entity_data(handle).unwrap();
                Some(SyzygyEntity::Arc {
                    handle: *handle,
                    data: SyzygyArc {
                        group: data.group,
                        center: sys.entity_data(&data.center).unwrap().coords,
                        begin: sys.entity_data(&data.arc_begin).unwrap().coords,
                        end: sys.entity_data(&data.arc_end).unwrap().coords,
                    },
                })
            }
            SomeEntityHandle::CircleOnWorkplane(handle) => {
                let data = sys.entity_data(handle).unwrap();
                Some(SyzygyEntity::Circle {
                    handle: *handle,
                    data: SyzygyCircle {
                        group: data.group,
                        center: sys.entity_data(&data.center).unwrap().coords,
                        radius: sys.entity_data(&data.radius).unwrap().val,
                    },
                })
            }
            SomeEntityHandle::CubicOnWorkplane(handle) => {
                let data = sys.entity_data(handle).unwrap();
                Some(SyzygyEntity::Cubic {
                    handle: *handle,
                    data: SyzygyCubic {
                        group: data.group,
                        start_point: sys.entity_data(&data.start_point).unwrap().coords,
                        start_control: sys.entity_data(&data.start_control).unwrap().coords,
                        end_control: sys.entity_data(&data.end_control).unwrap().coords,
                        end_point: sys.entity_data(&data.end_point).unwrap().coords,
                    },
                })
            }
            SomeEntityHandle::LineSegmentOnWorkplane(handle) => {
                let data = sys.entity_data(handle).unwrap();
                Some(SyzygyEntity::Line {
                    handle: *handle,
                    data: SyzygyLine {
                        group: data.group,
                        point_a: sys.entity_data(&data.point_a).unwrap().coords,
                        point_b: sys.entity_data(&data.point_b).unwrap().coords,
                    },
                })
            }
            SomeEntityHandle::PointOnWorkplane(handle) => Some(SyzygyEntity::Point {
                handle: *handle,
                data: sys.entity_data(handle).unwrap().into(),
            }),
            _ => None,
        })
        .collect()
}

#[tauri::command]
pub fn add_point(
    data: SyzygyPoint,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Point<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let OnWorkplane(u, v) = data.coords;
    sys.sketch(Point::<OnWorkplane>::new(data.group, canvas, u, v))
}
