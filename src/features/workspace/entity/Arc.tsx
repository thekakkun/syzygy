import { ArcData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Arc({
  data,
  temp = false,
}: {
  data: ArcData;
  temp?: boolean;
}) {
  let {
    center: [center_x, center_y],
    begin: [begin_x, begin_y],
    end: [end_x, end_y],
  } = data;
  let radius = Math.hypot(center_x - begin_x, center_y - begin_y);

  return (
    <path
      d={`
        M ${begin_x} ${begin_y}
        A ${radius} ${radius} 0 0 1 ${end_x} ${end_y}
      `}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
      fillOpacity={0}
    ></path>
  );
}
