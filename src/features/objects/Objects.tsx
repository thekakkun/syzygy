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
              handle={handle as unknown as number}
              entities={elements.entities}
            ></Group>
          ))}
        </ul>
      )}

      {/* <ul>
        {Object.entries(groups ?? {}).map(([handle, elements]) => {
          return <li>{handle}</li>;
        })}
      </ul> */}

      {/* <ul>
        {groups?.map((group) => {
          return <Group key={`group_${group}`} group={group}></Group>;
        })}
      </ul> */}
    </div>
  );
}
