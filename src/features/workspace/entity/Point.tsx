import { PointData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Point({
  data,
  temp = false,
}: {
  data: PointData;
  temp?: boolean;
}) {
  const point_size = 5;
  let [x, y] = data.coords;
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
      stroke={temp ? "lightblue" : "blue"}
      strokeWidth={1}
    ></path>
  );
}
