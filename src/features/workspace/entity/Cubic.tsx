import { CubicData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Cubic({
  data,
  temp = false,
}: {
  data: CubicData;
  temp?: boolean;
}) {
  let {
    start_point: [start_x, start_y],
    start_control: [start_control_x, start_control_y],
    end_control: [end_control_x, end_control_y],
    end_point: [end_x, end_y],
  } = data;

  return (
    <path
      d={`
        M ${start_x} ${start_y}
        C ${start_control_x} ${start_control_y},
        ${end_control_x} ${end_control_y},
        ${end_x} ${end_y}
      `}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
    ></path>
  );
}
