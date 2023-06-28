import { EntityData } from "../../app/slvs/slvsEntitiesSlice";
import { useAppSelector } from "../../app/store";
import { arcRadius } from "../../common/utils/geometry";

export default function EntityPath({
  handle,
  entityData,
}: {
  handle: number;
  entityData: EntityData;
}) {
  const point_size = 5;

  const selection = useAppSelector((state) => state.selection);
  let group_selected =
    selection.type === "group" && selection.handles.includes(entityData.group);
  let entity_selected =
    selection.type === "entity" && selection.handles.includes(handle);

  let selected = group_selected || entity_selected;

  switch (entityData.type) {
    case "ArcOfCircle": {
      let {
        start: [startX, startY],
        end: [endX, endY],
      } = entityData;
      let radius = arcRadius(entityData);

      return (
        <path
          d={`
            M ${startX} ${startY}
            A ${radius} ${radius} 0 0 1 ${endX} ${endY}
          `}
          stroke={selected ? "red" : "black"}
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
          stroke={selected ? "red" : "black"}
          strokeWidth={2}
          fillOpacity={0}
        ></circle>
      );
    }
    case "Cubic": {
      let {
        start_point: [startX, startY],
        start_control: [startControlX, startControlY],
        end_control: [endControlX, endControlY],
        end_point: [endX, endY],
      } = entityData;

      return (
        <g>
          <path
            d={`
              M ${startX} ${startY}
              C ${startControlX} ${startControlY},
              ${endControlX} ${endControlY},
              ${endX} ${endY}
          `}
            stroke={selected ? "red" : "black"}
            strokeWidth={2}
            fillOpacity={0}
          ></path>
          <path
            d={`
              M ${startX} ${startY}
              L ${startControlX} ${startControlY}
          `}
            stroke={"grey"}
            strokeWidth={1}
            fillOpacity={0}
          ></path>
          <path
            d={`
              M ${endX} ${endY}
              L ${endControlX} ${endControlY}
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
          stroke={selected ? "red" : "black"}
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
          stroke={selected ? "red" : "blue"}
          strokeWidth={1}
        ></path>
      );
    }
  }
}
