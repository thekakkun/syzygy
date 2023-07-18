import { PointData } from "../../../app/slvs/slvsEntitiesSlice";

export default function Point({ data }: { data: PointData }) {
  let [x, y] = data.coords;

  return (
    <dl>
      <dt>coordinates:</dt>
      <dd>{`(${x}, ${y})`}</dd>
    </dl>
  );
}
