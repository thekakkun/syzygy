import { useAppDispatch } from "../../app/store";
import { setCoord } from "../cursor/cursorSlice";
import style from "./Workspace.module.css";
import EntityPath from "./Entity";

export default function Workspace() {
  const dispatch = useAppDispatch();

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
        {/* {entities &&
          Object.entries(entities).map(([handle, entityData]) => {
            return (
              <EntityPath
                key={`entity_${handle}`}
                handle={parseInt(handle)}
                entityData={entityData}
              ></EntityPath>
            );
          })} */}
      </svg>
    </div>
  );
}
