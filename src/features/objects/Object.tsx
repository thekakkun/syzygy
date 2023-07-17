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
    <li>
      <span>Thingy {handle}</span>
      <ul>
        {object?.map((segment) => (
          <Entity key={segment.from.handle} segment={segment}></Entity>
        ))}
      </ul>
    </li>

    // <li onClick={() => dispatch(toggleSelection({ type: "group", handle }))}>
    //   <span
    //     className={
    //       selection.type === "group" && selection.handles.includes(handle)
    //         ? style.selected
    //         : ""
    //     }
    //   >
    //     Thingy {handle}
    //   </span>
    //   <ul>
    //     {entities.map((entity) => (
    //       <Entity
    //         key={`${entity.type}_${entity.handle}`}
    //         entity={entity}
    //       ></Entity>
    //     ))}
    //   </ul>
    // </li>
  );
}
