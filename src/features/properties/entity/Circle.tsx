import {
  CircleData,
  useGetCoordsQuery,
} from "../../../app/slvs/slvsEntitiesSlice";

export default function Circle({ data }: { data: CircleData }) {
  const { data: center } = useGetCoordsQuery(data.center);

  return (
    <dl>
      {center && (
        <>
          <dt>center:</dt>
          <dd>{`(${center[0]}, ${center[1]})`}</dd>
        </>
      )}

      <dt>radius:</dt>
      <dd>{data.radius.toFixed(2)}</dd>
    </dl>
  );
}
