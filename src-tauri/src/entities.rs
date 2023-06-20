use crate::{Canvas, Drawing};

use serde::{Deserialize, Serialize};
use slvs::{
    entity::{ArcOfCircle, Circle, Cubic, Distance, EntityHandle, LineSegment, Point},
    group::Group,
};
use tauri::State;

#[tauri::command]
pub fn get_entities(sys_state: State<Drawing>) -> Vec<SyzygyEntity> {
    let sys = sys_state.0.lock().unwrap();
    let handles = sys.entity_handles(None, None);

    handles
        .iter()
        .filter_map(|handle| {
            if let Ok(arc_handle) = EntityHandle::<ArcOfCircle>::try_from(handle) {
                let data = sys.entity_data(&arc_handle).unwrap();
                Some(SyzygyEntity::Arc {
                    handle: arc_handle,
                    data: SyzygyArc {
                        group: data.group,
                        center: sys.entity_data(&data.center).unwrap().into(),
                        start: sys.entity_data(&data.arc_start).unwrap().into(),
                        end: sys.entity_data(&data.arc_end).unwrap().into(),
                    },
                })
            } else if let Ok(circle_handle) = EntityHandle::<Circle>::try_from(handle) {
                let data = sys.entity_data(&circle_handle).unwrap();
                Some(SyzygyEntity::Circle {
                    handle: circle_handle,
                    data: SyzygyCircle {
                        group: data.group,
                        center: sys.entity_data(&data.center).unwrap().into(),
                        radius: sys.entity_data(&data.radius).unwrap().val,
                    },
                })
            } else if let Ok(cubic_handle) = EntityHandle::<Cubic>::try_from(handle) {
                let data = sys.entity_data(&cubic_handle).unwrap();
                Some(SyzygyEntity::Cubic {
                    handle: cubic_handle,
                    data: SyzygyCubic {
                        group: data.group,
                        start_point: sys.entity_data(&data.start_point).unwrap().into(),
                        start_control: sys.entity_data(&data.start_control).unwrap().into(),
                        end_control: sys.entity_data(&data.end_control).unwrap().into(),
                        end_point: sys.entity_data(&data.end_point).unwrap().into(),
                    },
                })
            } else if let Ok(line_handle) = EntityHandle::<LineSegment>::try_from(handle) {
                let data = sys.entity_data(&line_handle).unwrap();
                Some(SyzygyEntity::Line {
                    handle: line_handle,
                    data: SyzygyLine {
                        group: data.group,
                        point_a: sys.entity_data(&data.point_a).unwrap().into(),
                        point_b: sys.entity_data(&data.point_b).unwrap().into(),
                    },
                })
            } else if let Ok(point_handle) = EntityHandle::<Point>::try_from(handle) {
                if let Point::OnWorkplane { group, coords, .. } =
                    sys.entity_data(&point_handle).unwrap()
                {
                    Some(SyzygyEntity::Point {
                        handle: point_handle,
                        data: SyzygyPoint {
                            group,
                            coords: coords.into(),
                        },
                    })
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect()
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyArc {
    group: Group,
    center: Coords,
    start: Coords,
    end: Coords,
}

#[tauri::command]
pub fn add_arc(
    data: SyzygyArc,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<ArcOfCircle>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let center = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.center.into(),
    ))?;
    let start = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.start.into(),
    ))?;
    let end = sys.sketch(Point::new_on_workplane(data.group, canvas, data.end.into()))?;

    sys.sketch(ArcOfCircle::new(data.group, canvas, center, start, end))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCircle {
    group: Group,
    center: Coords,
    radius: f64,
}

#[tauri::command]
pub fn add_circle(
    data: SyzygyCircle,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Circle>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let center = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.center.into(),
    ))?;
    let radius = sys.sketch(Distance::new(data.group, data.radius))?;
    let normal = sys.entity_data(&canvas)?.normal;

    sys.sketch(Circle::new(data.group, normal, center, radius))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyCubic {
    group: Group,
    start_point: Coords,
    start_control: Coords,
    end_control: Coords,
    end_point: Coords,
}

#[tauri::command]
pub fn add_cubic(
    data: SyzygyCubic,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Cubic>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let start_point = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.start_point.into(),
    ))?;
    let start_control = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.start_control.into(),
    ))?;
    let end_control = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.end_control.into(),
    ))?;
    let end_point = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.end_point.into(),
    ))?;

    sys.sketch(Cubic::new(
        data.group,
        start_point,
        start_control,
        end_control,
        end_point,
    ))
}
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyLine {
    group: Group,
    point_a: Coords,
    point_b: Coords,
}

#[tauri::command]
pub fn add_line(
    data: SyzygyLine,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<LineSegment>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let point_a = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.point_a.into(),
    ))?;
    let point_b = sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.point_b.into(),
    ))?;

    sys.sketch(LineSegment::new(data.group, point_a, point_b))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct SyzygyPoint {
    group: Group,
    coords: Coords,
}

#[tauri::command]
pub fn add_point(
    data: SyzygyPoint,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Point>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    sys.sketch(Point::new_on_workplane(
        data.group,
        canvas,
        data.coords.into(),
    ))
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize)]
struct Coords([f64; 2]);

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

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SyzygyEntity {
    Arc {
        handle: EntityHandle<ArcOfCircle>,
        data: SyzygyArc,
    },
    Circle {
        handle: EntityHandle<Circle>,
        data: SyzygyCircle,
    },
    Cubic {
        handle: EntityHandle<Cubic>,
        data: SyzygyCubic,
    },
    Line {
        handle: EntityHandle<LineSegment>,
        data: SyzygyLine,
    },
    Point {
        handle: EntityHandle<Point>,
        data: SyzygyPoint,
    },
}
