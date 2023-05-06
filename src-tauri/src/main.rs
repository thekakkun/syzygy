// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use slvs::{
    entity::{Entity, Normal, Point, Workplane},
    group::Group,
    make_quaternion,
    target::{In3d, OnWorkplane},
    System,
};
use std::sync::Mutex;
use tauri::State;

struct Drawing(Mutex<System>);
struct Canvas(Mutex<Option<Entity<Workplane>>>);

#[tauri::command]
fn init_canvas(
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<Entity<Workplane>, &'static str> {
    let mut canvas_state = canvas_state.0.lock().unwrap();

    if let Some(canvas) = *canvas_state {
        Ok(canvas)
    } else {
        let mut sys = sys_state.0.lock().unwrap();
        let g = sys.add_group();

        let origin = sys.sketch(Point::<In3d>::new(g, 0.0, 0.0, 0.0))?;

        let normal = sys.sketch(Normal::new_in_3d(
            g,
            make_quaternion([1.0, 0.0, 0.0], [0.0, 1.0, 0.0]),
        ))?;

        *canvas_state = Some(sys.sketch(Workplane::new(g, origin, normal))?);
        Ok(canvas_state.unwrap())
    }
}

#[tauri::command]
fn add_group(state: State<Drawing>) -> Group {
    let mut sys = state.0.lock().unwrap();
    sys.add_group()
}

#[tauri::command]
fn add_point(
    group: Group,
    x: f64,
    y: f64,
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> Result<Entity<Point<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0.lock().unwrap();

    if let Some(canvas) = *canvas {
        sys.sketch(Point::<OnWorkplane>::new(group, canvas, x, y))
    } else {
        Err("No canvas initialized")
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Drawing(Default::default()))
        .manage(Canvas(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![init_canvas, add_group, add_point])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
