import {
  useAddGroupMutation,
  useGetGroupsQuery,
} from "../../app/slvs/slvsGroupsSlice";
import Group from "./Group";
import style from "./Objects.module.css";

export default function Objects() {
  const { data: groups } = useGetGroupsQuery();
  const [addGroup] = useAddGroupMutation();

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      {groups && (
        <ul>
          {Object.entries(groups).map(([handle, elements]) => (
            <Group
              key={`group_${handle}`}
              handle={parseInt(handle)}
              entities={elements.entities}
            ></Group>
          ))}
        </ul>
      )}
    </div>
  );
}
