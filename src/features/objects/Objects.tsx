import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import style from "./Objects.module.css";
import Object from "./Object";

export default function Objects() {
  const { data: objects } = useGetObjectsQuery();

  return (
    <div className={style.objects}>
      <ul>
        {objects?.map((handle) => (
          <Object key={`object_${handle}`} handle={handle}></Object>
        ))}
      </ul>
    </div>
  );
}
