import { useGetObjectsQuery } from "../../app/slvs/slvsObjectsSlice";
import SlvsObject from "./Object";
import style from "./Objects.module.css";

export default function SlvsObjects() {
  const { data: objects } = useGetObjectsQuery();

  return (
    <div className={style.objects}>
      <ul>
        {objects?.map((handle) => (
          <SlvsObject key={`object_${handle}`} handle={handle}></SlvsObject>
        ))}
      </ul>
    </div>
  );
}
