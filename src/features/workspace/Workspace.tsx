import { useGetEntitiesQuery } from "../../app/slvs/slvsEntitiesSlice";
import { useAppDispatch } from "../../app/store";
import { setCoord } from "../cursor/cursorSlice";
import style from "./Workspace.module.css";
import EntityPath from "./entity/Entity";

export default function Workspace() {
  const dispatch = useAppDispatch();
  const { data: entities } = useGetEntitiesQuery();
  // const [addEntity] = useAddEntityMutation();

  // const { selected } = useAppSelector((state) => state.selection);
  // const activeGroup = useAppSelector((state) => state.selection.group);

  // useEffect(() => {
  //   const tempEntityReady =
  //     "type" in selected && selected.coords.every(Boolean);
  //   if (tempEntityReady && activeGroup) {
  //     addEntity({ group: activeGroup, ...selected });
  //     dispatch(clearSelection());
  //   }
  // }, [selected, activeGroup]);

  return (
    <div className={style.workspace}>
      <svg
        className={style.canvas}
        width={500}
        height={500}
        onMouseMove={(e) =>
          dispatch(setCoord([e.nativeEvent.offsetX, e.nativeEvent.offsetY]))
        }
        // onClick={(e) => {
        //   if ("type" in selected) {
        //     dispatch(
        //       updateTempEntity([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
        //     );
        //   }
        // }}
      >
        {entities &&
          Object.values(entities).map((entityData, i) => (
            <EntityPath key={`entity_${i}`} {...{ entityData }}></EntityPath>
          ))}
      </svg>
    </div>
  );
}
