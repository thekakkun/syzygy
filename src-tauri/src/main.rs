// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use slvs::{
    entity::{EntityHandle, Normal, Point, Workplane},
    group::Group,
    make_quaternion,
    target::{In3d, OnWorkplane},
    System,
};
use std::sync::Mutex;
use tauri::{Manager, State};

struct Drawing(Mutex<System>);
struct Canvas(EntityHandle<Workplane>);

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
) -> Result<EntityHandle<Point<OnWorkplane>>, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    sys.sketch(Point::<OnWorkplane>::new(group, canvas, x, y))
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let mut sys = System::new();
            let g = sys.add_group();
            let origin = sys.sketch(Point::<In3d>::new(g, 0.0, 0.0, 0.0))?;
            let normal = sys.sketch(Normal::new_in_3d(
                g,
                make_quaternion([1.0, 0.0, 0.0], [0.0, 1.0, 0.0]),
            ))?;
            let canvas = sys.sketch(Workplane::new(g, origin, normal))?;

            app.manage(Drawing(Mutex::new(sys)));
            app.manage(Canvas(canvas));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_group, add_point])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
