import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { Segment } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import style from "./Entity.module.css";

export default function Entity({ segment }: { segment: Segment }) {
  const selection = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();

  segment.via;

  return "handle" in segment.via ? (
    <li>{`${segment.via.type} ${segment.via.handle}`}</li>
  ) : (
    <></>
  );

  // <li
  //   className={
  //     selection.type === "entity" && selection.handles.includes(entity.handle)
  //       ? style.selected
  //       : ""
  //   }
  //   onClick={(e) => {
  //     e.stopPropagation();
  //     dispatch(toggleSelection({ type: "entity", handle: entity.handle }));
  //   }}
  // >{`${entity.type} ${entity.handle}`}</li>
}
