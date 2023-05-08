import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPointer } from "./canvasSlice";
import style from "./Workspace.module.css";
import { addPoint } from "../drawing/entitiesSlice";
import { useEffect } from "react";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const point = useAppSelector((state) => state.canvas.pointer);
  const entities = useAppSelector((state) => state.entities.entities);

  useEffect(() => {
    console.log(entities);
  }, [entities]);

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
        onClick={(e) => {
          dispatch(addPoint({ group: 1, point: point }));
        }}
      ></svg>
    </div>
  );
}
