import { EntityData } from "../../../app/slvs/slvsEntitiesSlice";
import Arc from "./Arc";
import Circle from "./Circle";
import Cubic from "./Cubic";
import Line from "./Line";
import Point from "./Point";

export default function EntityPath({ entityData }: { entityData: EntityData }) {
  switch (entityData.type) {
    case "ArcOfCircle":
      return <Arc {...{ entityData }}></Arc>;

    case "Circle":
      return <Circle {...{ entityData }}></Circle>;

    case "Cubic":
      return <Cubic {...{ entityData }}></Cubic>;

    case "LineSegment":
      return <Line {...{ entityData }}></Line>;

    case "Point":
      return <Point {...{ entityData }}></Point>;
  }
}
