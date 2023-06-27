import { useAppSelector } from "../../../app/store";
import { TempEntity, cubicHandles } from "../../objects/OLDselectionSlice";
import Arc from "./Arc";
import Circle from "./Circle";
import Cubic from "./Cubic";
import Line from "./Line";
import Point from "./Point";

export default function TempEntityPath({ entity }: { entity: TempEntity }) {
  const cursor = useAppSelector((state) => state.cursor);
  let points = entity.coords.map((coord) => (coord ? coord : cursor.coord));

  switch (entity.type) {
    case "Arc":
      return (
        <>
          <Arc
            data={{ center: points[0], start: points[1], end: points[2] }}
            temp={true}
          ></Arc>
          <Point data={{ coords: points[0] }} temp={true}></Point>
          <Point data={{ coords: points[1] }} temp={true}></Point>
          <Point data={{ coords: points[2] }} temp={true}></Point>
        </>
      );

    case "Circle":
      let [centerX, centerY] = points[0];
      let [pointX, pointY] = points[1];

      return (
        <>
          <Circle
            data={{
              center: points[0],
              radius: Math.hypot(centerX - pointX, centerY - pointY),
            }}
            temp={true}
          ></Circle>
          <Point data={{ coords: points[0] }} temp={true}></Point>
          <Point data={{ coords: points[1] }} temp={true}></Point>
        </>
      );

    case "Cubic":
      let [startPoint, startControl, endControl, endPoint] = cubicHandles(
        points[0],
        points[1]
      );

      return (
        <Cubic
          data={{
            start_point: startPoint,
            start_control: startControl,
            end_control: endControl,
            end_point: endPoint,
          }}
          temp={true}
        ></Cubic>
      );

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
