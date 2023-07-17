use std::collections::HashMap;

use crate::{Canvas, Drawing};
use serde::Serialize;
use slvs::{element::AsHandle, entity::SomeEntityHandle, group::Group};
use tauri::State;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, serde::Deserialize)]
pub struct GroupData {
    entities: Vec<SomeEntityHandle>,
}

#[tauri::command]
pub fn get_groups(
    sys_state: State<Drawing>,
    canvas_state: State<Canvas>,
) -> HashMap<u32, GroupData> {
    let sys = sys_state.0.lock().unwrap();
    let canvas = canvas_state.0;
    let canvas_group = sys.entity_data(&canvas).unwrap().group;

    let mut groups = HashMap::new();
    sys.groups()
        .iter()
        .filter(|&group| *group != canvas_group)
        .for_each(|group| {
            let entities = sys
                .entity_handles(Some(group), None)
                .iter()
                .filter(|handle| {
                    matches!(
                        handle,
                        SomeEntityHandle::ArcOfCircle(_)
                            | SomeEntityHandle::Circle(_)
                            | SomeEntityHandle::Cubic(_)
                            | SomeEntityHandle::LineSegment(_)
                            | SomeEntityHandle::Point(_)
                    )
                })
                .cloned()
                .collect();
            groups.insert(group.handle(), GroupData { entities });
        });

    groups
}

#[tauri::command]
pub fn get_group(group: Group, sys_state: State<Drawing>) -> Result<GroupData, &'static str> {
    let sys = sys_state.0.lock().unwrap();
    let groups = sys.groups();

    if groups.contains(&group) {
        let entities = sys.entity_handles(Some(&group), None);
        Ok(GroupData { entities })
    } else {
        Err("Group not found.")
    }
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
