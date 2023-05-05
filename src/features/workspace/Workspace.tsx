import { useAppDispatch } from "../../app/hooks";
import { setPointer } from "./canvasSlice";
import style from "./Workspace.module.css";

export default function Workspace() {
  const dispatch = useAppDispatch();

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(
            setPointer({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
          )
        }
      ></svg>
    </div>
  );
}
