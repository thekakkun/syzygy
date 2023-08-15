import { ArcEntity } from "../../../common/types";

export default function ArcOfCircle({ data }: { data: ArcEntity }) {
  return (
    <dl>
      <dt>center:</dt>
      <dd>{`(${data.center.coords[0]}, ${data.center.coords[1]})`}</dd>

      <dt>radius:</dt>
      <dd>{data.radius.toFixed(2)}</dd>

      <dt>angle:</dt>
      <dd>{data.angle.toFixed(2)}</dd>
    </dl>
  );
}
