import style from "./Objects.module.css";

import {
  useAddGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
} from "../../app/slvs/slvsGroupsSlice";
import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useAppSelector } from "../../app/store";
import Group from "./Group";

export default function Objects() {
  const { data: groups } = useGetGroupsQuery();

  const [addGroup] = useAddGroupMutation();

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      <ul>
        {groups?.map((group) => {
          return <Group key={`group_${group}`} group={group}></Group>;
        })}
      </ul>
    </div>
  );
}
