import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch } from "../../app/store";
import { setCoord } from "../cursor/cursorSlice";
import SlvsObject from "./Object";
import style from "./Workspace.module.css";

export default function Workspace() {
  const dispatch = useAppDispatch();
  // const { data: objects } = useGetObjectsQuery();

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
        {/* {objects &&
          objects.map((objectHandle) => (
            <SlvsObject
              key={`thingy_${objectHandle}`}
              objectHandle={objectHandle}
            ></SlvsObject>
          ))} */}

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
