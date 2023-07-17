import { useEffect } from "react";
import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { useGetObjectQuery } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import Entity from "./Entity";
import style from "./Object.module.css";

export default function Object({ handle }: { handle: number }) {
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
        {object?.map((segment) => (
          <Entity key={segment.from.handle} segment={segment}></Entity>
        ))}
      </ul>
    </li>
  );
}
