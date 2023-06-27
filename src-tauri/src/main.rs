// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constraints;
mod entities;
mod groups;

use slvs::{
    entity::{ArcOfCircle, Circle, Distance, EntityHandle, LineSegment, Normal, Point, Workplane},
    group::Group,
    system::SolveResult,
    utils::make_quaternion,
    System,
};
use std::sync::Mutex;
use tauri::{Manager, State};

pub struct Drawing(Mutex<System>);
pub struct Canvas(EntityHandle<Workplane>);

#[tauri::command]
fn solve(group: Group, sys_state: State<Drawing>) -> Result<i32, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    if let SolveResult::Ok { dof } = sys.solve(&group) {
        Ok(dof)
    } else {
        Err("Unable to solve")
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let mut sys = System::new();
            let g = sys.add_group();
            let origin = sys.sketch(Point::new_in_3d(g, [0.0, 0.0, 0.0]))?;
            let normal = sys.sketch(Normal::new_in_3d(
                g,
                make_quaternion([1.0, 0.0, 0.0], [0.0, 1.0, 0.0]),
            ))?;
            let canvas = sys.sketch(Workplane::new(g, origin, normal))?;

            let g1 = sys.add_group();
            let p1 = sys
                .sketch(Point::new_on_workplane(g1, canvas, [10.0, 20.0]))
                .expect("point in 2d created");
            let p2 = sys
                .sketch(Point::new_on_workplane(g1, canvas, [20.0, 10.0]))
                .expect("point in 2d created");
            sys.sketch(LineSegment::new(g1, p1, p2))
                .expect("line segment created");
            let arc_center = sys
                .sketch(Point::new_on_workplane(g1, canvas, [100.0, 120.0]))
                .expect("point in 2d created");
            let arc_start = sys
                .sketch(Point::new_on_workplane(g1, canvas, [120.0, 110.0]))
                .expect("point in 2d created");
            let arc_end = sys
                .sketch(Point::new_on_workplane(g1, canvas, [115.0, 115.0]))
                .expect("point in 2d created");
            sys.sketch(ArcOfCircle::new(g1, canvas, arc_center, arc_start, arc_end))
                .expect("arc created");

            let g2 = sys.add_group();
            let circle_center = sys
                .sketch(Point::new_on_workplane(g2, canvas, [200.0, 200.0]))
                .expect("point in 2d created");
            let circle_radius = sys
                .sketch(Distance::new(g2, 30.0))
                .expect("distance created");
            let workplane_normal = sys
                .sketch(Normal::new_on_workplane(g2, canvas))
                .expect("2d normal created");
            sys.sketch(Circle::new(
                g2,
                workplane_normal,
                circle_center,
                circle_radius,
            ))
            .expect("circle created");

            app.manage(Drawing(Mutex::new(sys)));
            app.manage(Canvas(canvas));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            solve,
            groups::get_groups,
            groups::get_group,
            groups::add_group,
            groups::delete_group,
            entities::get_entities,
            entities::get_entity,
            entities::add_entity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
