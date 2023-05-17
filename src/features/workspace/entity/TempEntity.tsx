import { useAppSelector } from "../../../app/store";
import { TempEntity } from "../../objects/selectionSlice";
import Arc from "./Arc";
import Circle from "./Circle";
import Cubic from "./Cubic";
import Line from "./Line";
import Point from "./Point";

export default function TempEntityPath({ entity }: { entity: TempEntity }) {
  const cursor = useAppSelector((state) => state.cursor);
  let points = entity.coords.map((coord) => (coord ? coord : cursor.coord));

  switch (entity.type) {
    // case "Arc":
    //   return <Arc data={entity.data}></Arc>;

    // case "Circle":
    //   return <Circle data={entity.data}></Circle>;

    // case "Cubic":
    //   return <Cubic data={entity.data}></Cubic>;

    case "Line":
      return (
        <>
          <Line
            data={{ point_a: points[0], point_b: points[1] }}
            temp={true}
          ></Line>
          <Point data={{ coords: points[0] }} temp={true}></Point>
          <Point data={{ coords: points[1] }} temp={true}></Point>
        </>
      );

    case "Point":
      return <Point data={{ coords: points[0] }} temp={true}></Point>;
  }
}
