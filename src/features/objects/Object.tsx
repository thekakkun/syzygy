import { useGetObjectQuery } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { ObjectHandle } from "../../common/types";
import { toggleSelection } from "../cursor/selectionSlice";
import Entity from "./Entity";
import style from "./Object.module.css";

export default function Object({ handle }: { handle: ObjectHandle }) {
  const selection = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();
  const { data: object } = useGetObjectQuery(handle);

  return (
    <li
      className={
        selection.type === "object" && selection.handles.includes(handle)
          ? style.selected
          : undefined
      }
      onClick={() => dispatch(toggleSelection({ type: "object", handle }))}
    >
      Thingy {handle}
      <ul>
        {object?.type === "Circle" ? (
          <Entity
            key={`${object.type}_${object.handle}`}
            handle={object.handle}
          ></Entity>
        ) : (
          object?.segments.map((segment) => (
            <Entity
              key={`${segment.via.type}_${segment.via.handle}`}
              handle={segment.via}
            ></Entity>
          ))
        )}
      </ul>
    </li>
  );
}
