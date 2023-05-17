import { CubicData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Cubic({
  data,
  temp = false,
}: {
  data: CubicData;
  temp?: boolean;
}) {
  let {
    start_point: [startX, startY],
    start_control: [start_controlX, start_controlY],
    end_control: [end_controlX, end_controlY],
    end_point: [endX, endY],
  } = data;

  return (
    <g>
      <path
        d={`
          M ${startX} ${startY}
          C ${start_controlX} ${start_controlY},
          ${end_controlX} ${end_controlY},
          ${endX} ${endY}
      `}
        stroke={temp ? "grey" : "black"}
        strokeWidth={2}
        fillOpacity={0}
      ></path>
      <path
        d={`
          M ${startX} ${startY}
          L ${start_controlX} ${start_controlY}
      `}
        stroke={temp ? "silver" : "grey"}
        strokeWidth={1}
        fillOpacity={0}
      ></path>
      <path
        d={`
          M ${endX} ${endY}
          L ${end_controlX} ${end_controlY}
      `}
        stroke={temp ? "silver" : "grey"}
        strokeWidth={1}
        fillOpacity={0}
      ></path>
    </g>
  );
}
