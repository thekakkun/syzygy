import { CubicEntity } from "../../../common/types";

export default function Cubic({ data }: { data: CubicEntity }) {
  return (
    <dl>
      <dt>start point:</dt>
      <dd>{`(${data.start_point.coords[0]}, ${data.start_point.coords[1]})`}</dd>

      <dt>start control:</dt>
      <dd>{`(${data.start_control.coords[0]}, ${data.start_control.coords[1]})`}</dd>

      <dt>end control:</dt>
      <dd>{`(${data.end_control.coords[0]}, ${data.end_control.coords[1]})`}</dd>

      <dt>end point:</dt>
      <dd>{`(${data.end_point.coords[0]}, ${data.end_point.coords[1]})`}</dd>
    </dl>
  );
}
