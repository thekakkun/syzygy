import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import Entity from "./Entity";

export default function Group({
  handle,
  entities,
}: {
  handle: number;
  entities: EntityHandle[];
}) {
  const dispatch = useAppDispatch();

  return (
    <li onClick={() => dispatch(toggleSelection({ type: "group", handle }))}>
      Thingy {handle}
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
