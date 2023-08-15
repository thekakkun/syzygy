import { PointEntity } from "../../../common/types";

export default function Point({ data }: { data: PointEntity }) {
  return (
    <dl>
      <dt>coordinates:</dt>
      <dd>{`(${data.coords[0]}, ${data.coords[1]})`}</dd>
    </dl>
  );
}
