import { LineData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Line({ entityData }: { entityData: LineData }) {
  let {
    point_a: [pointAX, pointAY],
    point_b: [pointBX, pointBY],
  } = entityData;

  return (
    <path
      d={`
        M ${pointAX} ${pointAY}
        L ${pointBX} ${pointBY}
      `}
      stroke={"black"}
      strokeWidth={2}
    ></path>
  );
}
