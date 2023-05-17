import { CubicData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Cubic({
  data,
  temp = false,
}: {
  data: CubicData;
  temp?: boolean;
}) {
  let {
    startPoint: [startX, startY],
    startControl: [start_controlX, start_controlY],
    endControl: [end_controlX, end_controlY],
    endPoint: [endX, endY],
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
