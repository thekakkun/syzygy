import {
  LineSegmentData,
  useGetCoordsQuery,
} from "../../../app/slvs/slvsEntitiesSlice";

export default function LineSegment({ data }: { data: LineSegmentData }) {
  const { data: pointA } = useGetCoordsQuery(data.point_a);
  const { data: pointB } = useGetCoordsQuery(data.point_b);

  return (
    <dl>
      {pointA && (
        <>
          <dt>point a:</dt>
          <dd>{`(${pointA[0]}, ${pointA[1]})`}</dd>
        </>
      )}

      {pointB && (
        <>
          <dt>point b:</dt>
          <dd>{`(${pointB[0]}, ${pointB[1]})`}</dd>
        </>
      )}
    </dl>
  );
}
