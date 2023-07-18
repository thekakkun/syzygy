import { useEffect, useState } from "react";
import { Coords } from "../types";

export function useArcOfCircle(
  center: Coords | undefined,
  start: Coords | undefined,
  end: Coords | undefined
) {
  const [radius, setRadius] = useState<number | null>(null);
  useEffect(() => {
    if (center && start && end) {
      setRadius(Math.hypot(center[0] - start[0], center[1] - start[1]));
    }
  }, [center, start, end]);

  const [angle, setAngle] = useState<number | null>(null);
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
