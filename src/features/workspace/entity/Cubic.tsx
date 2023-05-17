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
    <path
      d={`
        M ${startX} ${startY}
        C ${start_controlX} ${start_controlY},
        ${end_controlX} ${end_controlY},
        ${endX} ${endY}
      `}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
    ></path>
  );
}
