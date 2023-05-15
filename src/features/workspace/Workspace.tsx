import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch } from "../../app/store";
import style from "./Workspace.module.css";
import Arc from "./entity/Arc";
import Circle from "./entity/Circle";
import Cubic from "./entity/Cubic";
import Line from "./entity/Line";
import Point from "./entity/Point";
import { setPointer } from "./workspaceSlice";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const { data: entities } = useGetEntitiesQuery();

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(setPointer([e.nativeEvent.offsetX, e.nativeEvent.offsetY]))
        }
      >
        {entities?.map((entity) => {
          switch (entity.type) {
            case "Arc":
              return (
                <Arc
                  key={`entity_${entity.handle.handle}`}
                  data={entity.data}
                ></Arc>
              );

            case "Circle":
              return (
                <Circle
                  key={`entity_${entity.handle.handle}`}
                  data={entity.data}
                ></Circle>
              );

            case "Cubic":
              return (
                <Cubic
                  key={`entity_${entity.handle.handle}`}
                  data={entity.data}
                ></Cubic>
              );

            case "Line":
              return (
                <Line
                  key={`entity_${entity.handle.handle}`}
                  data={entity.data}
                ></Line>
              );

            case "Point":
              return (
                <Point
                  key={`entity_${entity.handle.handle}`}
                  data={entity.data}
                ></Point>
              );
          }
        })}
      </svg>
    </div>
  );
}
