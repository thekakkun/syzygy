import style from "./Objects.module.css";

import {
  useAddGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
} from "../slvs/slvsGroupsSlice";

export default function Objects() {
  const { data: groups, isLoading, isSuccess } = useGetGroupsQuery();
  const [addGroup] = useAddGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      <ul>
        {groups?.map((group) => (
          <li key={group} onClick={() => deleteGroup(group)}>
            {group}
          </li>
        ))}
      </ul>
    </div>
  );
}
