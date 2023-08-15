import { LineEntity } from "../../../common/types";

export default function LineSegment({ data }: { data: LineEntity }) {
  return (
    <dl>
      <dt>point a:</dt>
      <dd>{`(${data.point_a.coords[0]}, ${data.point_a.coords[1]})`}</dd>

      <dt>point b:</dt>
      <dd>{`(${data.point_b.coords[0]}, ${data.point_b.coords[1]})`}</dd>
    </dl>
  );
}
