import { CircleData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Circle({
  data,
  temp,
}: {
  data: CircleData;
  temp?: boolean;
}) {
  let {
    center: [center_x, center_y],
    radius,
  } = data;

  return (
    <circle
      cx={center_x}
      cy={center_y}
      r={radius}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
      fillOpacity={0}
    ></circle>
  );
}
