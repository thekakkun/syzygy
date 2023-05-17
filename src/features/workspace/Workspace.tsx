import { useEffect } from "react";
import {
  useAddEntityMutation,
  useGetEntitiesQuery,
} from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { setCoord } from "../cursor/cursorSlice";
import { clearSelection, updateTempEntity } from "../objects/selectionSlice";
import style from "./Workspace.module.css";
import EntityPath from "./entity/Entity";
import TempEntityPath from "./entity/TempEntity";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const { data: entities } = useGetEntitiesQuery();
  const [addEntity] = useAddEntityMutation();

  const { selected } = useAppSelector((state) => state.selection);
  const active_group = useAppSelector((state) => state.selection.group);

  useEffect(() => {
    const tempEntityReady =
      "type" in selected && selected.coords.every(Boolean);
    if (tempEntityReady && active_group) {
      addEntity({ group: active_group, ...selected });
      dispatch(clearSelection());
    }
  }, [selected, active_group]);

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(setCoord([e.nativeEvent.offsetX, e.nativeEvent.offsetY]))
        }
        onClick={(e) => {
          if ("type" in selected) {
            dispatch(
              updateTempEntity([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
            );
          }
        }}
      >
        {entities?.map((entity) => (
          <EntityPath
            key={`entity_${entity.handle.handle}`}
            entity={entity}
          ></EntityPath>
        ))}

        {"type" in selected ? (
          <TempEntityPath entity={selected}></TempEntityPath>
        ) : null}
      </svg>
    </div>
  );
}
