import { useAppSelector } from "../../app/store";
import Entity from "./Entity";
import SlvsObject from "./Object";
import style from "./Properties.module.css";

export default function Properties() {
  // const selection = useAppSelector((state) => state.selection);

  return (
    <div className={style.properties}>
      {/* {selection.type === "object" ? (
        <SlvsObject handles={selection.handles}></SlvsObject>
      ) : selection.type === "entity" ? (
        <Entity handles={selection.handles}></Entity>
      ) : (
        <></>
      )} */}
    </div>
  );
}
