import { EntityData } from "../../app/slvs/slvsEntitiesSlice";

export default function EntityPath({ entityData }: { entityData: EntityData }) {
  const point_size = 5;

  switch (entityData.type) {
    case "ArcOfCircle": {
      let {
        center: [centerX, centerY],
        start: [startX, startY],
        end: [endX, endY],
      } = entityData;
      let radius = Math.hypot(centerX - startX, centerY - startY);

      return (
        <path
          d={`
            M ${startX} ${startY}
            A ${radius} ${radius} 0 0 1 ${endX} ${endY}
          `}
          stroke={"black"}
          strokeWidth={2}
          fillOpacity={0}
        ></path>
      );
    }

    case "Circle": {
      let {
        center: [centerX, centerY],
        radius,
      } = entityData;

      return (
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={"black"}
          strokeWidth={2}
          fillOpacity={0}
        ></circle>
      );
    }
    case "Cubic": {
      let {
        start_point: [startX, startY],
        start_control: [start_controlX, start_controlY],
        end_control: [end_controlX, end_controlY],
        end_point: [endX, endY],
      } = entityData;

      return (
        <g>
          <path
            d={`
              M ${startX} ${startY}
              C ${start_controlX} ${start_controlY},
              ${end_controlX} ${end_controlY},
              ${endX} ${endY}
          `}
            stroke={"black"}
            strokeWidth={2}
            fillOpacity={0}
          ></path>
          <path
            d={`
              M ${startX} ${startY}
              L ${start_controlX} ${start_controlY}
          `}
            stroke={"grey"}
            strokeWidth={1}
            fillOpacity={0}
          ></path>
          <path
            d={`
              M ${endX} ${endY}
              L ${end_controlX} ${end_controlY}
          `}
            stroke={"grey"}
            strokeWidth={1}
            fillOpacity={0}
          ></path>
        </g>
      );
    }

    case "LineSegment": {
      let {
        point_a: [pointAX, pointAY],
        point_b: [pointBX, pointBY],
      } = entityData;

      return (
        <path
          d={`
            M ${pointAX} ${pointAY}
            L ${pointBX} ${pointBY}
          `}
          stroke={"black"}
          strokeWidth={2}
        ></path>
      );
    }

    case "Point": {
      let [x, y] = entityData.coords;
      return (
        <path
          d={`
            M ${x - point_size / 2} ${y - point_size / 2}
            h ${point_size}
            v ${point_size}
            h ${-point_size}
            Z
          `}
          fill="white"
          stroke={"blue"}
          strokeWidth={1}
        ></path>
      );
    }
  }
}
