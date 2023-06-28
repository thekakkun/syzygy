import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import style from "./Entity.module.css";

export default function Entity({ entity }: { entity: EntityHandle }) {
  const { type, handles } = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();

  return (
    <li
      className={
        type === "entity" && handles.includes(entity.handle)
          ? style.selected
          : ""
      }
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleSelection({ type: "entity", handle: entity.handle }));
      }}
    >{`${entity.type} ${entity.handle}`}</li>
  );
}
