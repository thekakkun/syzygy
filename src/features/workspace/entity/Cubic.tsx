import { CubicData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Cubic({ entityData }: { entityData: CubicData }) {
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
