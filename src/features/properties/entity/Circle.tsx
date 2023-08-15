import { CircleEntity } from "../../../common/types";

export default function Circle({ data }: { data: CircleEntity }) {
  return (
    <dl>
      <dt>center:</dt>
      <dd>{`(${data.center.coords[0]}, ${data.center.coords[1]})`}</dd>

      <dt>radius:</dt>
      <dd>{data.radius.toFixed(2)}</dd>
    </dl>
  );
}
