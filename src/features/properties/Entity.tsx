import { useGetEntityQuery } from "../../app/slvs/slvsEntitiesSlice";
import { EntityHandle } from "../../common/types";
import ArcOfCircle from "./entity/ArcOfCircle";
import Circle from "./entity/Circle";
import Cubic from "./entity/Cubic";
import LineSegment from "./entity/LineSegment";
import Point from "./entity/Point";

export default function Entity({ handles }: { handles: EntityHandle[] }) {
  switch (handles.length) {
    case 0:
      return <p>Nothing selected</p>;
    case 1:
      const handle = handles[0];
      const { data: entityData } = useGetEntityQuery(handle);

      return (
        <>
          <p>{`${handle.type} ${handle.handle}`}</p>
          {entityData &&
            (entityData.type === "ArcOfCircle" ? (
              <ArcOfCircle data={entityData}></ArcOfCircle>
            ) : entityData.type === "Circle" ? (
              <Circle data={entityData}></Circle>
            ) : entityData.type === "Cubic" ? (
              <Cubic data={entityData}></Cubic>
            ) : entityData.type === "LineSegment" ? (
              <LineSegment data={entityData}></LineSegment>
            ) : entityData.type === "Point" ? (
              <Point data={entityData}></Point>
            ) : (
              <></>
            ))}
        </>
      );
    default:
      return (
        <p>Entities {handles.map((handle) => handle.handle).join(", ")}</p>
      );
  }
}
