use crate::{Canvas, Drawing};

use serde::{Deserialize, Serialize};
use slvs::{
    entity::{
        ArcOfCircle, Circle, Cubic, Distance, EntityHandle, LineSegment, Point, SomeEntityHandle,
    },
    group::Group,
    target::OnWorkplane,
};
use tauri::State;

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
                        start: sys.entity_data(&data.arc_begin).unwrap().coords,
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyArc {
    group: Group,
    center: OnWorkplane,
    start: OnWorkplane,
    end: OnWorkplane,
}

#[tauri::command]
pub fn add_arc(
    data: SyzygyArc,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<ArcOfCircle>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let OnWorkplane(center_u, center_v) = data.center;
    let center = sys.sketch(Point::<OnWorkplane>::new(
        data.group, canvas, center_u, center_v,
    ))?;

    let OnWorkplane(start_u, start_v) = data.start;
    let start = sys.sketch(Point::<OnWorkplane>::new(
        data.group, canvas, start_u, start_v,
    ))?;

    let OnWorkplane(end_u, end_v) = data.end;
    let end = sys.sketch(Point::<OnWorkplane>::new(data.group, canvas, end_u, end_v))?;

    let normal = sys.entity_data(&canvas)?.normal;

    sys.sketch(ArcOfCircle::new(
        data.group, canvas, center, start, end, normal,
    ))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCircle {
    group: Group,
    center: OnWorkplane,
    radius: f64,
}

#[tauri::command]
pub fn add_circle(
    data: SyzygyCircle,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Circle<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let OnWorkplane(center_u, center_v) = data.center;
    let center = sys.sketch(Point::<OnWorkplane>::new(
        data.group, canvas, center_u, center_v,
    ))?;

    let radius = sys.sketch(Distance::<OnWorkplane>::new(
        data.group,
        canvas,
        data.radius,
    ))?;

    let normal = sys.entity_data(&canvas)?.normal;

    sys.sketch(Circle::<OnWorkplane>::new(
        data.group, canvas, center, radius, normal,
    ))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCubic {
    group: Group,
    start_point: OnWorkplane,
    start_control: OnWorkplane,
    end_control: OnWorkplane,
    end_point: OnWorkplane,
}

#[tauri::command]
pub fn add_cubic(
    data: SyzygyCubic,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Cubic<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let OnWorkplane(start_point_u, start_point_v) = data.start_point;
    let start_point = sys.sketch(Point::<OnWorkplane>::new(
        data.group,
        canvas,
        start_point_u,
        start_point_v,
    ))?;

    let OnWorkplane(start_control_u, start_control_v) = data.start_control;
    let start_control = sys.sketch(Point::<OnWorkplane>::new(
        data.group,
        canvas,
        start_control_u,
        start_control_v,
    ))?;

    let OnWorkplane(end_control_u, end_control_v) = data.end_control;
    let end_control = sys.sketch(Point::<OnWorkplane>::new(
        data.group,
        canvas,
        end_control_u,
        end_control_v,
    ))?;

    let OnWorkplane(end_point_u, end_point_v) = data.end_point;
    let end_point = sys.sketch(Point::<OnWorkplane>::new(
        data.group,
        canvas,
        end_point_u,
        end_point_v,
    ))?;

    sys.sketch(Cubic::<OnWorkplane>::new(
        data.group,
        canvas,
        start_point,
        start_control,
        end_control,
        end_point,
    ))
}
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyLine {
    group: Group,
    point_a: OnWorkplane,
    point_b: OnWorkplane,
}

#[tauri::command]
pub fn add_line(
    data: SyzygyLine,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<LineSegment<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let OnWorkplane(a_u, a_v) = data.point_a;
    let point_a = sys.sketch(Point::<OnWorkplane>::new(data.group, canvas, a_u, a_v))?;

    let OnWorkplane(b_u, b_v) = data.point_b;
    let point_b = sys.sketch(Point::<OnWorkplane>::new(data.group, canvas, b_u, b_v))?;

    sys.sketch(LineSegment::<OnWorkplane>::new(
        data.group, canvas, point_a, point_b,
    ))
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
