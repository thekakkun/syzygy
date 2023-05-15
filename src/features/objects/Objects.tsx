import style from "./Objects.module.css";

import {
  useAddGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
} from "../../app/slvs/slvsGroupsSlice";
import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useEffect } from "react";

export default function Objects() {
  const { data: groups } = useGetGroupsQuery();
  const { data: entities } = useGetEntitiesQuery();
  const [addGroup] = useAddGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  useEffect(() => console.log(entities), []);

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      <ul>
        {groups?.map((group) => (
          <li key={group} onClick={() => deleteGroup(group)}>
            {group}
            <ul>
              {entities
                ?.filter((entity) => entity.data.group === group)
                .map((entity) => (
                  <li>{entity.type}</li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
