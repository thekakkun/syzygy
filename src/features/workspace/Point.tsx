import { useGetEntityQuery } from "../../app/slvs/slvsEntitiesSlice";
import { EntityHandle, PointEntity } from "../../common/types";

export default function Point({
  point_handle,
}: {
  point_handle: EntityHandle & { type: "Point" };
}) {
  let { data } = useGetEntityQuery(point_handle) as { data: PointEntity };
  const point_size = 5;

  return (
    <path
      d={
        data
          ? `M ${data.coords[0] - point_size / 2}, ${
              data.coords[1] - point_size / 2
            } L ${data.coords[0] + point_size / 2}, ${
              data.coords[1] - point_size / 2
            } L ${data.coords[0] + point_size / 2}, ${
              data.coords[1] + point_size / 2
            } L ${data.coords[0] - point_size / 2}, ${
              data.coords[1] + point_size / 2
            } Z`
          : ""
      }
      stroke="blue"
      strokeWidth={1}
      fillOpacity={0}
    ></path>
  );
}
