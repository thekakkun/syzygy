import { useAppSelector } from "../../app/store";
import { ElementType } from "../cursor/selectionSlice";
import Entity from "./Entity";
import Group from "./Group";
import style from "./Properties.module.css";

export default function Properties() {
  const { type, handles } = useAppSelector((state) => state.selection);
  return <div className={style.properties}>{getProperty(type, handles)}</div>;
}

function getProperty(type: ElementType, handles: number[]) {
  switch (type) {
    case "group":
      return <Group handles={handles}></Group>;
    case "entity":
      return <Entity handles={handles}></Entity>;
  }
}
