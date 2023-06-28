import { ArcData } from "../../app/slvs/slvsEntitiesSlice";

export function arcRadius(arcData: ArcData) {
  let {
    center: [centerX, centerY],
    start: [startX, startY],
  } = arcData;
  return Math.hypot(centerX - startX, centerY - startY);
}

export function arcAngle(arcData: ArcData) {
  let {
    center: [centerX, centerY],
    start: [startX, startY],
    end: [endX, endY],
  } = arcData;
  let startVec = [startX - centerX, startY - centerY];
  let endVec = [endX - centerX, endY - centerY];

  const startAngle = Math.atan2(startVec[1], startVec[0]);
  const endAngle = Math.atan2(endVec[1], endVec[0]);
  let angle = endAngle - startAngle;
  
  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  return (angle * 180) / Math.PI;
}
