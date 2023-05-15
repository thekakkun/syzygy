import { useAppDispatch } from "../../app/store";
import { setPointer } from "./workspaceSlice";
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
          dispatch(setPointer([e.nativeEvent.offsetX, e.nativeEvent.offsetY]))
        }
      ></svg>
    </div>
  );
}
