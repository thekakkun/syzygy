import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch } from "../../app/store";
import { setCoord } from "../cursor/cursorSlice";
import Object from "./Object";
import style from "./Workspace.module.css";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const { data: objects } = useGetObjectsQuery();

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(setCoord([e.nativeEvent.offsetX, e.nativeEvent.offsetY]))
        }
      >
        {objects &&
          objects.map((objectHandle) => (
            <Object
              key={`thingy_${objectHandle}`}
              handle={objectHandle}
            ></Object>
          ))}
      </svg>
    </div>
  );
}
