import { LineData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Line({
  data,
  temp = false,
}: {
  data: LineData;
  temp?: boolean;
}) {
  let {
    point_a: [pointAX, pointAY],
    point_b: [pointBX, pointBY],
  } = data;

  return (
    <path
      d={`
        M ${pointAX} ${pointAY}
        L ${pointBX} ${pointBY}
      `}
      stroke={temp ? "silver" : "black"}
      strokeWidth={2}
    ></path>
  );
}
