import { ArcData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Arc({
  data,
  temp = false,
}: {
  data: ArcData;
  temp?: boolean;
}) {
  let {
    center: [centerX, centerY],
    start: [startX, startY],
    end: [endX, endY],
  } = data;
  let radius = Math.hypot(centerX - startX, centerY - startY);

  return (
    <path
      d={`
        M ${startX} ${startY}
        A ${radius} ${radius} 0 0 1 ${endX} ${endY}
      `}
      stroke={temp ? "grey" : "black"}
      strokeWidth={2}
      fillOpacity={0}
    ></path>
  );
}
