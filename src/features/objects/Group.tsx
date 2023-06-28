import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import Entity from "./Entity";
import style from "./Group.module.css";

export default function Group({
  handle,
  entities,
}: {
  handle: number;
  entities: EntityHandle[];
}) {
  const { type, handles } = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();

  return (
    <li onClick={() => dispatch(toggleSelection({ type: "group", handle }))}>
      <span
        className={
          type === "group" && handles.includes(handle) ? style.selected : ""
        }
      >
        Thingy {handle}
      </span>
      <ul>
        {entities.map((entity) => (
          <Entity
            key={`${entity.type}_${entity.handle}`}
            entity={entity}
          ></Entity>
        ))}
      </ul>
    </li>
  );
}
