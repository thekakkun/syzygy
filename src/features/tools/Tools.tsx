import { useAppDispatch } from "../../app/store";
import { setMode } from "../workspace/workspaceSlice";
import style from "./Tools.module.css";

export default function Tools() {
  const dispatch = useAppDispatch();

  return (
    <div className={style.tools}>
      <ul>
        <li>
          Sketch
          <ul>
            <li>
              <button onClick={() => dispatch(setMode("Point"))}>Point</button>
            </li>
            <li>
              <button onClick={() => dispatch(setMode("Line"))}>Line</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
