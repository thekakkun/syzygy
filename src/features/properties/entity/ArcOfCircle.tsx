import {
  ArcOfCircleData,
  useGetCoordsQuery,
} from "../../../app/slvs/slvsEntitiesSlice";
import { useArcOfCircle } from "../../../common/hooks/useArcOfCircle";

export default function ArcOfCircle({ data }: { data: ArcOfCircleData }) {
  const { data: center } = useGetCoordsQuery(data.center);
  const { data: start } = useGetCoordsQuery(data.start);
  const { data: end } = useGetCoordsQuery(data.end);

  const { radius, angle } = useArcOfCircle(center, start, end);

  return (
    <dl>
      {center && (
        <>
          <dt>center:</dt>
          <dd>{`(${center[0]}, ${center[1]})`}</dd>
        </>
      )}

      {radius && (
        <>
          <dt>radius:</dt>
          <dd>{radius.toFixed(2)}</dd>
        </>
      )}

      {angle && (
        <>
          <dt>angle:</dt>
          <dd>{angle.toFixed(2)}</dd>
        </>
      )}
    </dl>
  );
}
