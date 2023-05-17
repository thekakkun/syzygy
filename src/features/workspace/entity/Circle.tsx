import { CircleData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Circle({
  data,
  temp,
}: {
  data: CircleData;
  temp?: boolean;
}) {
  let {
    center: [centerX, centerY],
    radius,
  } = data;

  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
      fillOpacity={0}
    ></circle>
  );
}
