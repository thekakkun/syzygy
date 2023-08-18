import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch } from "../../app/store";
import { EntityHandle } from "../../common/types";
import { setCoord } from "../cursor/cursorSlice";
import Object from "./Object";
import Point from "./Point";
import style from "./Workspace.module.css";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const { data: objects } = useGetObjectsQuery();
  const { data: handles } = useGetEntitiesQuery();

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
        {handles &&
          handles
            .filter((handle) => handle.type === "Point")
            .map((point_handle) => (
              <Point
                key={`point_${point_handle.handle}`}
                point_handle={point_handle as EntityHandle & { type: "Point" }}
              ></Point>
            ))}
      </svg>
    </div>
  );
}
