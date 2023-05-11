use super::Drawing;
use slvs::group::Group;
use tauri::State;

#[tauri::command]
pub fn get_groups(sys_state: State<Drawing>) -> Vec<Group> {
    let sys = sys_state.0.lock().unwrap();
    sys.group_handles()
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
