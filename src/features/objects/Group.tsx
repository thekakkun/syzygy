import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useDeleteGroupMutation } from "../../app/slvs/slvsGroupsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { activateGroup } from "./selectionSlice";
import style from "./Group.module.css";

export default function Group({ group }: { group: number }) {
  const { data: entities } = useGetEntitiesQuery();
  const [deleteGroup] = useDeleteGroupMutation();

  const active_group =
    useAppSelector((state) => state.selection.group) === group;
  const dispatch = useAppDispatch();

  return (
    <li
      className={`${active_group ? style.activeGroup : style.group}`}
      onClick={() => dispatch(activateGroup(group))}
    >
      <p className={style.label}>{`Group ${group}`}</p>
      <button className={style.delete} onClick={() => deleteGroup(group)}>
        x
      </button>
      {/* <ul>
              {entities
                ?.filter((entity) => entity.data.group === group)
                .map((entity) => (
                  <li
                    key={`entity_${entity.handle.handle}`}
                  >{`entity_${entity.handle.handle} (${entity.type})`}</li>
                ))}
            </ul> */}
    </li>
  );
}
