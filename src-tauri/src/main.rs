// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constraints;
mod entities;
mod groups;

use slvs::{
    entity::{EntityHandle, Normal, Point, Workplane},
    make_quaternion,
    target::In3d,
    System,
};
use std::sync::Mutex;
use tauri::Manager;

pub struct Drawing(Mutex<System>);
pub struct Canvas(EntityHandle<Workplane>);

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
        .invoke_handler(tauri::generate_handler![
            groups::get_groups,
            groups::add_group,
            groups::delete_group,
            entities::get_entities,
            entities::add_arc,
            entities::add_circle,
            entities::add_line,
            entities::add_point
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
