import { useEffect, useState } from "react";
import {
  ArcOfCircleData,
  useGetCoordsQuery,
} from "../../app/slvs/slvsEntitiesSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";

export function useArcOfCircle(arcData?: ArcOfCircleData) {
  const { data: center } = useGetCoordsQuery(
    arcData ? arcData.center : skipToken
  );
  const { data: start } = useGetCoordsQuery(
    arcData ? arcData.start : skipToken
  );
  const { data: end } = useGetCoordsQuery(arcData ? arcData.end : skipToken);

  const [radius, setRadius] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (center && start && end) {
      setRadius(Math.hypot(center[0] - start[0], center[1] - start[1]));
    }
  }, [center, start, end]);

  const [angle, setAngle] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (center && start && end) {
      const startVec = [start[0] - center[0], start[1] - center[1]];
      const endVec = [end[0] - center[0], end[1] - center[1]];

      const startAngle = Math.atan2(startVec[1], startVec[0]);
      const endAngle = Math.atan2(endVec[1], endVec[0]);
      let angle = endAngle - startAngle;

      if (angle < 0) {
        angle += 2 * Math.PI;
      }

      setAngle((angle * 180) / Math.PI);
    }
  }, [center, start, end]);

  return { radius, angle };
}
