import { useAppSelector } from "../../app/store";
import Entity from "./Entity";
import Object from "./Object";
import style from "./Properties.module.css";

export default function Properties() {
  const selection = useAppSelector((state) => state.selection);

  return (
    <div className={style.properties}>
      {selection.type === "object" ? (
        <Object handles={selection.handles}></Object>
      ) : selection.type === "entity" ? (
        <Entity handles={selection.handles}></Entity>
      ) : (
        <></>
      )}
    </div>
  );
}
