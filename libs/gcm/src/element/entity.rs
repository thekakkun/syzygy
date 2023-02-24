use wasm_bindgen::prelude::*;
use super::parameter::Param;

#[wasm_bindgen]
pub struct PointIn3d {
    param: [Param; 3],
}

#[wasm_bindgen]
pub struct PointIn2d {
    wrkpl: Workplane,
    param: [Param; 2],
}

#[wasm_bindgen]
pub struct NormalIn3d {
    param: [Param; 4],
}

#[wasm_bindgen]
pub struct NormalIn2d {
    wrkpl: Workplane,
}

#[wasm_bindgen]
pub struct Distance {
    param: [Param; 1],
}

#[wasm_bindgen]
pub struct Workplane {
    point: [PointIn3d; 1],
    normal: NormalIn3d,
}

#[wasm_bindgen]
pub struct LineSegment {
    point: [PointIn2d; 2],
}

#[wasm_bindgen]
pub struct Cubic {
    point: [PointIn2d; 4],
}

#[wasm_bindgen]
pub struct Circle {
    normal: NormalIn2d,
    point: [PointIn2d; 1],
    distance: Distance,
}

#[wasm_bindgen]
pub struct ArcOfCircle {
    wrkpl: Workplane,
    point: [PointIn2d; 3],
    normal: NormalIn3d,
}
