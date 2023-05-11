use serde::{Deserialize, Serialize};
use slvs::{
    entity::{
        ArcOfCircle, Circle, Cubic, Distance, EntityHandle, LineSegment, Point, SomeEntityHandle,
    },
    group::Group,
    target::OnWorkplane,
};
use tauri::State;

use crate::{Canvas, Drawing};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SyzygyEntities {
    Arc {
        handle: EntityHandle<ArcOfCircle>,
        data: ArcOfCircle,
    },
    Circle {
        handle: EntityHandle<Circle<OnWorkplane>>,
        data: Circle<OnWorkplane>,
    },
    Cubic {
        handle: EntityHandle<Cubic<OnWorkplane>>,
        data: Cubic<OnWorkplane>,
    },
    Distance {
        handle: EntityHandle<Distance<OnWorkplane>>,
        data: Distance<OnWorkplane>,
    },
    Line {
        handle: EntityHandle<LineSegment<OnWorkplane>>,
        data: LineSegment<OnWorkplane>,
    },
    Point {
        handle: EntityHandle<Point<OnWorkplane>>,
        data: Point<OnWorkplane>,
    },
}

#[tauri::command]
pub fn get_entities(sys_state: State<Drawing>) -> Vec<SyzygyEntities> {
    let sys = sys_state.0.lock().unwrap();
    let handles = sys.entity_handles();

    handles
        .iter()
        .filter_map(|handle| match handle {
            SomeEntityHandle::ArcOfCircle(handle) => Some(SyzygyEntities::Arc {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            SomeEntityHandle::CircleOnWorkplane(handle) => Some(SyzygyEntities::Circle {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            SomeEntityHandle::CubicOnWorkplane(handle) => Some(SyzygyEntities::Cubic {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            SomeEntityHandle::DistanceOnWorkplane(handle) => Some(SyzygyEntities::Distance {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            SomeEntityHandle::LineSegmentOnWorkplane(handle) => Some(SyzygyEntities::Line {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            SomeEntityHandle::PointOnWorkplane(handle) => Some(SyzygyEntities::Point {
                handle: *handle,
                data: sys.entity_data(handle).unwrap(),
            }),
            _ => None,
        })
        .collect()
}

#[tauri::command]
pub fn add_point(
    group: Group,
    x: f64,
    y: f64,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<EntityHandle<Point<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    sys.sketch(Point::<OnWorkplane>::new(group, canvas, x, y))
}
