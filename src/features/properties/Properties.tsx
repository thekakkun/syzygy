import { useAppSelector } from "../../app/store";
import { Selection } from "../cursor/selectionSlice";
import Entity from "./Entity";
import Group from "./Group";
import style from "./Properties.module.css";

export default function Properties() {
  const selection = useAppSelector((state) => state.selection);

  return <div className={style.properties}>{getProperty(selection)}</div>;
}

function getProperty(selection: Selection) {
  switch (selection.type) {
    case "group":
      return <Group handles={selection.handles}></Group>;
    case "entity":
      return <Entity handles={selection.handles}></Entity>;
  }
}
