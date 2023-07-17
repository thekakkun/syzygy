import { useAddGroupMutation } from "../../app/slvs/slvsGroupsSlice";
import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import style from "./Objects.module.css";
import Object from "./Object";

export default function Objects() {
  const [addGroup] = useAddGroupMutation();

  const { data: objects } = useGetObjectsQuery();

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      <ul>
        {objects?.map((handle) => (
          <Object key={`object_${handle}`} handle={handle}></Object>
        ))}
      </ul>
    </div>
  );
}
