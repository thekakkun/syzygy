import { useAppDispatch, useAppSelector } from "../../app/store";
import { EntityHandle } from "../../common/types";
import { toggleSelection } from "../cursor/selectionSlice";
import style from "./Entity.module.css";

export default function Entity({ handle }: { handle: EntityHandle }) {
  const selection = useAppSelector((state) => state.selection);
  const dispatch = useAppDispatch();

  return (
    <li
      className={
        selection.type === "entity" && selection.handles.includes(handle)
          ? style.selected
          : ""
      }
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          toggleSelection({
            type: "entity",
            handle: handle,
          })
        );
      }}
    >{`${handle.type} ${handle.handle}`}</li>
  );
}
