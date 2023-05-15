import { LineData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Line({ data }: { data: LineData }) {
  let {
    point_a: [point_a_x, point_a_y],
    point_b: [point_b_x, point_b_y],
  } = data;

  return (
    <path
      d={`
        M ${point_a_x} ${point_a_y}
        L ${point_b_x} ${point_b_y}
      `}
      stroke="red"
      strokeWidth={2}
    ></path>
  );
}
