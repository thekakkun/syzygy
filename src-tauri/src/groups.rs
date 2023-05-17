use crate::{Canvas, Drawing};
use slvs::group::Group;
use tauri::State;

#[tauri::command]
pub fn get_groups(sys_state: State<Drawing>, canvas_state: State<Canvas>) -> Vec<Group> {
    let sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;

    let canvas_group = sys.entity_data(&canvas).expect("Canvas exists").group;
    sys.group_handles()
        .iter()
        .filter(|&group| *group != canvas_group)
        .cloned()
        .collect()
}

#[tauri::command]
pub fn add_group(sys_state: State<Drawing>) -> Group {
    let mut sys = sys_state.0.lock().unwrap();
    sys.add_group()
}

#[tauri::command]
pub fn delete_group(group: Group, sys_state: State<Drawing>) -> Result<Group, &'static str> {
    let mut sys = sys_state.0.lock().unwrap();
    sys.delete_group(group)
}
