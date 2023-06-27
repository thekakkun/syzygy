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
  // const { data: entities } = useGetEntitiesQuery();
  // const [deleteGroup] = useDeleteGroupMutation();

  // const active_group =
  //   useAppSelector((state) => state.selection.group) === group;
  const dispatch = useAppDispatch();

  return (
    <li onClick={() => dispatch(toggleSelection({ type: "group", handle }))}>
      {handle}
      <ul>
        {entities.map((entity) => (
          <Entity
            key={`${entity.type}_${entity.handle}`}
            entity={entity}
          ></Entity>
        ))}
      </ul>
    </li>

    // <li
    //   className={`${active_group ? style.activeGroup : style.group}`}
    //   onClick={() => dispatch(activateGroup(group))}
    // >
    //   <p className={style.label}>{`Group ${group}`}</p>
    //   <button className={style.delete} onClick={() => deleteGroup(group)}>
    //     x
    //   </button>
    //   {/* <ul>
    //           {entities
    //             ?.filter((entity) => entity.data.group === group)
    //             .map((entity) => (
    //               <li
    //                 key={`entity_${entity.handle.handle}`}
    //               >{`entity_${entity.handle.handle} (${entity.type})`}</li>
    //             ))}
    //         </ul> */}
    // </li>
  );
}
