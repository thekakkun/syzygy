use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Param {
    val: f64,
}

#[wasm_bindgen]
impl Param {
    pub fn new(val: f64) -> Self {
        Self { val }
    }
}
