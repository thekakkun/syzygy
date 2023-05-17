import { useAddGroupMutation } from "../../app/slvs/slvsGroupsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { addTempEntity } from "../objects/selectionSlice";

import style from "./Toolbar.module.css";

export default function Toolbar() {
  const dispatch = useAppDispatch();
  const active_group = useAppSelector((state) => state.selection.group);
  const [addGroup] = useAddGroupMutation();

  return (
    <div className={style.tools}>
      <ul>
        <li>
          Sketch
          <ul>
            <li>
              <button
                onClick={() => {
                  if (!active_group) {
                    addGroup();
                  }
                  dispatch(addTempEntity("Arc"));
                }}
              >
                Arc
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!active_group) {
                    addGroup();
                  }
                  dispatch(addTempEntity("Circle"));
                }}
              >
                Circle
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!active_group) {
                    addGroup();
                  }
                  dispatch(addTempEntity("Line"));
                }}
              >
                Line
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!active_group) {
                    addGroup();
                  }
                  dispatch(addTempEntity("Point"));
                }}
              >
                Point
              </button>
            </li>
          </ul>
        </li>
        <li>Constrain</li>
      </ul>
    </div>
  );
}
