import {
  EntityData,
  useGetEntitiesQuery,
} from "../../app/slvs/slvsEntitiesSlice";
import { arcAngle, arcRadius } from "../../common/utils/geometry";

export default function Entity({ handles }: { handles: number[] }) {
  switch (handles.length) {
    case 0:
      return <p>Nothing selected</p>;
    case 1:
      const handle = handles[0];
      const { entityData } = useGetEntitiesQuery(undefined, {
        selectFromResult: ({ data }) => ({
          entityData: data?.[handle],
        }),
      });

      return (
        <>
          <p>
            {entityData?.type} {handle}
          </p>
          {entityData && entityProperty(entityData)}
        </>
      );
    default:
      return <p>Entities {handles.join(", ")}</p>;
  }
}

function entityProperty(entityData: EntityData) {
  switch (entityData.type) {
    case "ArcOfCircle": {
      let {
        center: [centerX, centerY],
      } = entityData;

      return (
        <dl>
          <dt>center:</dt>
          <dd>{`(${centerX}, ${centerY})`}</dd>

          <dt>radius:</dt>
          <dd>{arcRadius(entityData).toFixed(2)}</dd>

          <dt>angle:</dt>
          <dd>{arcAngle(entityData).toFixed(2)}</dd>
        </dl>
      );
    }

    case "Circle": {
      let {
        center: [centerX, centerY],
        radius,
      } = entityData;

      return (
        <dl>
          <dt>center:</dt>
          <dd>{`(${centerX}, ${centerY})`}</dd>

          <dt>radius:</dt>
          <dd>{radius.toFixed(2)}</dd>
        </dl>
      );
    }

    case "Cubic": {
      let {
        start_point: [startX, startY],
        start_control: [startControlX, startControlY],
        end_control: [endControlX, endControlY],
        end_point: [endX, endY],
      } = entityData;

      return (
        <dl>
          <dt>start point:</dt>
          <dd>{`(${startX}, ${startY})`}</dd>

          <dt>start control:</dt>
          <dd>{`(${startControlX}, ${startControlY})`}</dd>

          <dt>end point:</dt>
          <dd>{`(${endX}, ${endY})`}</dd>

          <dt>end control:</dt>
          <dd>{`(${endControlX}, ${endControlY})`}</dd>
        </dl>
      );
    }

    case "LineSegment": {
      let {
        point_a: [pointAX, pointAY],
        point_b: [pointBX, pointBY],
      } = entityData;

      return (
        <dl>
          <dt>point A:</dt>
          <dd>{`(${pointAX}, ${pointAY})`}</dd>

          <dt>point B:</dt>
          <dd>{`(${pointBX}, ${pointBY})`}</dd>
        </dl>
      );
    }
    case "Point": {
      let [x, y] = entityData.coords;

      return (
        <dl>
          <dt>coordinates:</dt>
          <dd>{`(${x}, ${y})`}</dd>
        </dl>
      );
    }
  }
}
