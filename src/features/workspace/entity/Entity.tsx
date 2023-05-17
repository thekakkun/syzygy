import { Entity } from "../../../app/slvs/slvsEntitiesSlice";
import Arc from "./Arc";
import Circle from "./Circle";
import Cubic from "./Cubic";
import Line from "./Line";
import Point from "./Point";

export default function EntityPath({ entity }: { entity: Entity }) {
  switch (entity.type) {
    case "Arc":
      return <Arc data={entity.data}></Arc>;

    case "Circle":
      return <Circle data={entity.data}></Circle>;

    case "Cubic":
      return <Cubic data={entity.data}></Cubic>;

    case "Line":
      return <Line data={entity.data}></Line>;

    case "Point":
      return <Point data={entity.data}></Point>;
  }
}
