// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod constraints;
mod entities;
mod groups;

use slvs::{
    entity::{ArcOfCircle, Circle, Distance, EntityHandle, LineSegment, Normal, Point, Workplane},
    make_quaternion,
    target::{In3d, OnWorkplane},
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

            let g2 = sys.add_group();

            // These points are represented by their coordinates (u v) within the
            // workplane, so they need only two parameters each.
            let p1 = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 10.0, 20.0))
                .expect("point in 2d created");
            let p2 = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 20.0, 10.0))
                .expect("point in 2d created");
            // And we create a line segment with those endpoints.
            let line = sys
                .sketch(LineSegment::<OnWorkplane>::new(g2, canvas, p1, p2))
                .expect("line segment created");

            // Now three more points.
            let arc_center = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 100.0, 120.0))
                .expect("point in 2d created");
            let arc_start = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 120.0, 110.0))
                .expect("point in 2d created");
            let arc_finish = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 115.0, 115.0))
                .expect("point in 2d created");
            // And arc, centered at point arc_center, starting at point arc_start, ending at
            // point arc_finish.
            let arc = sys
                .sketch(ArcOfCircle::new(
                    g2, canvas, arc_center, arc_start, arc_finish, normal,
                ))
                .expect("arc created");

            // Now one more point, and a distance
            let circle_center = sys
                .sketch(Point::<OnWorkplane>::new(g2, canvas, 200.0, 200.0))
                .expect("point in 2d created");
            let circle_radius = sys
                .sketch(Distance::<OnWorkplane>::new(g2, canvas, 30.0))
                .expect("distance created");
            // And a complete circle, centered at point circle_center with radius equal to
            // distance circle_radius. The normal is the same as our workplane.
            let circle = sys
                .sketch(Circle::<OnWorkplane>::new(
                    g2,
                    canvas,
                    circle_center,
                    circle_radius,
                    normal,
                ))
                .expect("circle created");

            app.manage(Drawing(Mutex::new(sys)));
            app.manage(Canvas(canvas));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            groups::get_groups,
            groups::add_group,
            groups::delete_group,
            entities::get_entities,
            entities::add_point
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
