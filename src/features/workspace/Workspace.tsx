import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { moveTo } from "./cursorSlice";
import style from "./Workspace.module.css";

export default function Workspace() {
  const cursor = useAppSelector((state) => state.cursor);
  const dispatch = useAppDispatch();

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(
            moveTo({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
          )
        }
      ></svg>
    </div>
  );
}
