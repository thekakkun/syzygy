// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constraints;
mod entities;
mod groups;
mod objects;

use slvs::{
    constraint::PointsCoincident,
    entity::{
        ArcOfCircle, Circle, Cubic, Distance, EntityHandle, LineSegment, Normal, Point, Workplane,
    },
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
fn solve(handle: Group, sys_state: State<Drawing>) -> Result<i32, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    if let SolveResult::Ok { dof } = sys.solve(&handle) {
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

            // Draw a circle
            let circle_group = sys.add_group();
            let circle_center = sys
                .sketch(Point::new_on_workplane(
                    circle_group,
                    canvas,
                    [100.0, 100.0],
                ))
                .expect("point in 2d created");
            let circle_radius = sys
                .sketch(Distance::new(circle_group, 50.0))
                .expect("distance created");
            let workplane_normal = sys
                .sketch(Normal::new_on_workplane(circle_group, canvas))
                .expect("2d normal created");
            sys.sketch(Circle::new(
                circle_group,
                workplane_normal,
                circle_center,
                circle_radius,
            ))
            .expect("circle created");

            // Draw a triangle
            let triangle_group = sys.add_group();
            let p1a = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [250.0, 50.0],
                ))
                .expect("point in 2d created");
            let p1b = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [250.0, 150.0],
                ))
                .expect("point in 2d created");
            sys.sketch(LineSegment::new(triangle_group, p1a, p1b))
                .expect("line segment created");
            let p2a = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [250.0, 150.0],
                ))
                .expect("point in 2d created");
            let p2b = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [350.0, 150.0],
                ))
                .expect("point in 2d created");
            sys.sketch(LineSegment::new(triangle_group, p2a, p2b))
                .expect("line segment created");
            let p3a = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [350.0, 150.0],
                ))
                .expect("point in 2d created");
            let p3b = sys
                .sketch(Point::new_on_workplane(
                    triangle_group,
                    canvas,
                    [250.0, 50.0],
                ))
                .expect("point in 2d created");
            sys.sketch(LineSegment::new(triangle_group, p3a, p3b))
                .expect("line segment created");
            sys.constrain(PointsCoincident::new(triangle_group, p1b, p2a, None))
                .expect("constraint added");
            sys.constrain(PointsCoincident::new(triangle_group, p2b, p3a, None))
                .expect("constraint added");
            sys.constrain(PointsCoincident::new(triangle_group, p3b, p1a, None))
                .expect("constraint added");

            // Draw a squiggle
            let squiggle_group = sys.add_group();
            let arc_center = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [100.0, 300.0],
                ))
                .expect("point in 2d created");
            let arc_start = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [150.0, 300.0],
                ))
                .expect("point in 2d created");
            let arc_end = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [100.0, 350.0],
                ))
                .expect("point in 2d created");
            sys.sketch(ArcOfCircle::new(
                squiggle_group,
                canvas,
                arc_center,
                arc_start,
                arc_end,
            ))
            .expect("arc created");
            let pa = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [100.0, 350.0],
                ))
                .expect("point in 2d created");
            let pb = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [250.0, 350.0],
                ))
                .expect("point in 2d created");
            sys.sketch(LineSegment::new(squiggle_group, pa, pb))
                .expect("line segment created");
            let p_s = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [250.0, 350.0],
                ))
                .expect("point in 2d created");
            let p_sc = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [300.0, 350.0],
                ))
                .expect("point in 2d created");
            let p_ec = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [350.0, 300.0],
                ))
                .expect("point in 2d created");
            let p_e = sys
                .sketch(Point::new_on_workplane(
                    squiggle_group,
                    canvas,
                    [400.0, 300.0],
                ))
                .expect("point in 2d created");
            sys.sketch(Cubic::new(squiggle_group, p_s, p_sc, p_ec, p_e))
                .expect("cubic created");
            sys.constrain(PointsCoincident::new(squiggle_group, arc_end, pa, None))
                .expect("constraint added");
            sys.constrain(PointsCoincident::new(squiggle_group, pb, p_s, None))
                .expect("constraint added");

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
            // entities::get_entities,
            entities::get_entity,
            // entities::point,
            // entities::add_entity,
            objects::get_objects,
            objects::get_object,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
