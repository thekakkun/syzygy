import {
  CubicData,
  useGetCoordsQuery,
} from "../../../app/slvs/slvsEntitiesSlice";

export default function Cubic({ data }: { data: CubicData }) {
  const { data: startPoint } = useGetCoordsQuery(data.start_point);
  const { data: startControl } = useGetCoordsQuery(data.start_control);
  const { data: endControl } = useGetCoordsQuery(data.end_control);
  const { data: endPoint } = useGetCoordsQuery(data.end_point);

  return (
    <dl>
      {startPoint && (
        <>
          <dt>start point:</dt>
          <dd>{`(${startPoint[0]}, ${startPoint[1]})`}</dd>
        </>
      )}

      {startControl && (
        <>
          <dt>start control:</dt>
          <dd>{`(${startControl[0]}, ${startControl[1]})`}</dd>
        </>
      )}

      {endControl && (
        <>
          <dt>end control:</dt>
          <dd>{`(${endControl[0]}, ${endControl[1]})`}</dd>
        </>
      )}

      {endPoint && (
        <>
          <dt>end point:</dt>
          <dd>{`(${endPoint[0]}, ${endPoint[1]})`}</dd>
        </>
      )}
    </dl>
  );
}
