import { CircleData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Circle({ entityData }: { entityData: CircleData }) {
  let {
    center: [centerX, centerY],
    radius,
  } = entityData;

  return (
    <circle
      cx={centerX}
      cy={centerY}
      r={radius}
      stroke={"black"}
      strokeWidth={2}
      fillOpacity={0}
    ></circle>
  );
}
