use wasm_bindgen::prelude::*;

use element::parameter::Param;

pub mod element;

#[wasm_bindgen]
pub struct SlvsSystem {
    param: Vec<Param>,
    // entity: Vec<entity::SlvsEntity>,
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
