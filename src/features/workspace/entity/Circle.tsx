import { CircleData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Circle({ data }: { data: CircleData }) {
  let {
    center: [center_x, center_y],
    radius,
  } = data;

  return (
    <circle
      cx={center_x}
      cy={center_y}
      r={radius}
      
      stroke="red"
      strokeWidth={2}
      fillOpacity={0}
    ></circle>
  );
}
