import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";

export default function Entity({ entity }: { entity: EntityHandle }) {
  const dispatch = useAppDispatch();
  return (
    <li
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleSelection({ type: "entity", handle: entity.handle }));
      }}
    >{`${entity.type} ${entity.handle}`}</li>
  );
}
