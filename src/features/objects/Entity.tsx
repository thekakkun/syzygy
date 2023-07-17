import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";
import { Segment } from "../../app/slvs/slvsObjectsSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { toggleSelection } from "../cursor/selectionSlice";
import style from "./Entity.module.css";

export default function Entity({ segment }: { segment: Segment }) {
  const selection = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();

  return "handle" in segment.via ? (
    <li
      className={
        selection.type === "entity" &&
        selection.handles.includes(segment.via.handle)
          ? style.selected
          : ""
      }
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          toggleSelection({
            type: "entity",
            handle: (segment.via as EntityHandle).handle,
          })
        );
      }}
    >{`${segment.via.type} ${segment.via.handle}`}</li>
  ) : (
    <></>
  );
}
