import { useAppDispatch } from "../../app/store";
import { addTempEntity } from "../objects/selectionSlice";

import style from "./Toolbar.module.css";

export default function Toolbar() {
  const dispatch = useAppDispatch();

  return (
    <div className={style.tools}>
      <ul>
        <li>
          Sketch
          <ul>
            <li>
              <button onClick={() => dispatch(addTempEntity("Point"))}>
                Point
              </button>
            </li>
            <li>
              <button onClick={() => dispatch(addTempEntity("Line"))}>
                Line
              </button>
            </li>
          </ul>
        </li>
        <li>Constrain</li>
      </ul>
    </div>
  );
}
