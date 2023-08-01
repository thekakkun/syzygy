import { useEffect, useState } from "react";
import { Segment, SlvsObject } from "../../app/slvs/slvsObjectsSlice";
import {
  ArcOfCircleData,
  CubicData,
  LineSegmentData,
  useGetCoordsQuery,
  useGetEntityQuery,
} from "../../app/slvs/slvsEntitiesSlice";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useArcOfCircle } from "./useArcOfCircle";

interface SegmentData {
  moveTo: string;
  draw: string;
}

export function usePathData(segments?: SlvsObject) {
  const [pathData, setPathData] = useState<SegmentData[]>([]);
  const [pathClosed, setPathClosed] = useState<boolean>(false);

  if (segments) {
    setPathData(segments.map((segment) => useSegmentData(segment)));
  }

  if (segments) {
    if (segments[segments.length - 1].via.type === "Close") {
      setPathClosed(true);
    }
  }

  return { pathData, pathClosed };
}

function useSegmentData(segment: Segment) {
  const [segmentData, setSegmentData] = useState<SegmentData>({
    moveTo: "",
    draw: "",
  });

  const { data: fromPoint } = useGetCoordsQuery(segment.from);
  useEffect(() => {
    if (fromPoint) {
      setSegmentData({ ...segmentData, moveTo: `M ${fromPoint.join(" ")}` });
    }
  }, [fromPoint]);

  const arcPathData = useArcPathData(segment);
  const cubicPathData = useCubicPathData(segment);
  const linePathData = useLinePathData(segment);

  if (arcPathData) {
    setSegmentData({ ...segmentData, draw: arcPathData });
  } else if (cubicPathData) {
    setSegmentData({ ...segmentData, draw: cubicPathData });
  } else if (linePathData) {
    setSegmentData({ ...segmentData, draw: linePathData });
  }

  return segmentData;
}

function useArcPathData(segment: Segment) {
  const [arcPathData, setArcPathData] = useState("");

  const { data: arcData } = useGetEntityQuery(
    segment.via.type === "ArcOfCircle" ? segment.via : skipToken
  ) as { data: ArcOfCircleData | undefined };
  const { radius, angle } = useArcOfCircle(arcData);
  const { data: endPoint } = useGetCoordsQuery(
    arcData
      ? segment.from.handle === arcData.start.handle
        ? arcData.end
        : arcData.start
      : skipToken
  );

  useEffect(() => {
    if (arcData && radius && angle && endPoint) {
      setArcPathData(`A ${radius} ${radius} 0
        ${angle < 180 ? 0 : 1}
        ${segment.from.handle === arcData.start.handle ? 0 : 1}
        `);
    }
  }, [arcData, radius, angle, endPoint]);

  return arcPathData;
}

function useCubicPathData(segment: Segment) {
  const [cubicPathData, setCubicPathData] = useState("");

  const { data: cubicData } = useGetEntityQuery(
    segment.via.type === "Cubic" ? segment.via : skipToken
  ) as { data: CubicData | undefined };

  const { data: fromControl } = useGetCoordsQuery(
    cubicData
      ? segment.from.handle === cubicData.start_point.handle
        ? cubicData.start_control
        : cubicData.end_control
      : skipToken
  );
  const { data: toControl } = useGetCoordsQuery(
    cubicData
      ? segment.from.handle === cubicData.start_point.handle
        ? cubicData.end_control
        : cubicData.start_control
      : skipToken
  );
  const { data: lineTo } = useGetCoordsQuery(
    cubicData
      ? segment.from.handle === cubicData.start_point.handle
        ? cubicData.end_point
        : cubicData.start_point
      : skipToken
  );

  useEffect(() => {
    if (fromControl && toControl && lineTo) {
      setCubicPathData(`C ${fromControl.join(" ")},
          ${toControl.join(" ")},
          ${lineTo.join(" ")}`);
    }
  }, [fromControl, toControl, lineTo]);

  return cubicPathData;
}

function useLinePathData(segment: Segment) {
  const [linePathData, setLinePathData] = useState("");
  const { data: lineData } = useGetEntityQuery(
    segment.via.type === "LineSegment" ? segment.via : skipToken
  ) as { data: LineSegmentData | undefined };

  const { data: lineTo } = useGetCoordsQuery(
    lineData
      ? segment.from.handle === lineData.point_a.handle
        ? lineData.point_b
        : lineData.point_a
      : skipToken
  );

  useEffect(() => {
    if (lineTo) {
      setLinePathData(`L ${lineTo.join(" ")}`);
    }
  }, [lineTo]);

  return linePathData;
}

// export function usePaths(segments?: SlvsObject) {
//   const [paths, setPaths] = useState<SegmentCommand[]>([]);
//   if (!segments) {
//     return [];
//   }

//   setPaths(segments.map((segment) => usePathCommand(segment)));

//   return paths;
// }

// export function usePathCommand(segment: Segment) {
//   const [command, setCommand] = useState({
//     moveTo: "",
//     line: "",
//     closePath: false,
//   });

//   // Move cursor to start
//   const { data: fromPoint } = useGetCoordsQuery(segment.from);
//   useEffect(() => {
//     if (fromPoint) {
//       setCommand({ ...command, moveTo: `M ${fromPoint.join(" ")}` });
//     }
//   }, [fromPoint]);

//   // const { data: arcData } = useGetEntityQuery(
//   //   segment.via.type === "ArcOfCircle" ? segment.via : skipToken
//   // ) as { data: ArcOfCircleData | undefined };
//   // const { radius, angle } = useArcOfCircle(arcData);
//   // const { data: endPoint } = useGetCoordsQuery(
//   //   arcData
//   //     ? segment.from.handle === arcData.start.handle
//   //       ? arcData.end
//   //       : arcData.start
//   //     : skipToken
//   // );

//   // Draw path from start
//   // const arcPath = useArcCommand(segment);
//   // const cubicPath = useCubicCommand(segment);
//   // const linePath = useLineCommand(segment);

//   // useEffect(() => {
//   //   setCommand({ ...command, line: arcPath || cubicPath || linePath });
//   // }, [arcPath, cubicPath, linePath]);

//   // // Close shape if that's the case
//   // if (segment.via.type === "Close") {
//   //   setCommand({ ...command, closePath: "Z" });
//   // }

//   switch (segment.via.type) {
//     case "Close":
//       setCommand({ ...command, closePath: true });
//       break;

//     case "Move":
//       break;

//     case "ArcOfCircle":
//       const { data: arcData } = useGetEntityQuery(segment.via);
//       if (arcData && !("start" in arcData)) {
//         throw new Error("Expected data for arc.");
//       }
//       const { radius, angle } = useArcOfCircle(arcData);
//       const { data: endPoint } = useGetCoordsQuery(
//         arcData
//           ? segment.from.handle === arcData.start.handle
//             ? arcData.end
//             : arcData.start
//           : skipToken
//       );

//       useEffect(() => {
//         if (arcData && radius && angle && endPoint) {
//           setCommand({
//             ...command,
//             line: `A ${radius} ${radius} 0
//             ${angle < 180 ? 0 : 1}
//             ${segment.from.handle === arcData.start.handle ? 0 : 1}
//             `,
//           });
//         }
//       }, [arcData, radius, angle, endPoint]);

//       break;

//     case "Cubic": {
//       const { data: cubicData } = useGetEntityQuery(segment.via);
//       if (cubicData && !("start_control" in cubicData)) {
//         throw new Error("Expected data for cubic.");
//       }

//       const { data: fromControl } = useGetCoordsQuery(
//         cubicData
//           ? segment.from.handle === cubicData.start_point.handle
//             ? cubicData.start_control
//             : cubicData.end_control
//           : skipToken
//       );
//       const { data: toControl } = useGetCoordsQuery(
//         cubicData
//           ? segment.from.handle === cubicData.start_point.handle
//             ? cubicData.end_control
//             : cubicData.start_control
//           : skipToken
//       );
//       const { data: lineTo } = useGetCoordsQuery(
//         cubicData
//           ? segment.from.handle === cubicData.start_point.handle
//             ? cubicData.end_point
//             : cubicData.start_point
//           : skipToken
//       );

//       useEffect(() => {
//         if (fromControl && toControl && lineTo) {
//           setCommand({
//             ...command,
//             line: `C ${fromControl.join(" ")},
//               ${toControl.join(" ")},
//               ${lineTo.join(" ")}`,
//           });
//         }
//       }, [fromControl, toControl, lineTo]);

//       break;
//     }

//     case "LineSegment": {
//       const { data: lineData } = useGetEntityQuery(segment.via);
//       if (lineData && !("point_a" in lineData)) {
//         throw new Error("Expected data for line segment.");
//       }

//       const { data: lineTo } = useGetCoordsQuery(
//         lineData
//           ? segment.from.handle === lineData.point_a.handle
//             ? lineData.point_b
//             : lineData.point_a
//           : skipToken
//       );

//       useEffect(() => {
//         if (lineTo) {
//           setCommand({ ...command, line: `L ${lineTo.join(" ")}` });
//         }
//       }, [lineTo]);

//       break;
//     }

//     case "End":
//     case "Circle":
//     case "Point":
//       break;
//   }

//   return command;
// }

function useArcCommand(segment: Segment) {
  const [command, setCommand] = useState("");
  const { data: arcData } = useGetEntityQuery(
    segment.via.type === "ArcOfCircle" ? segment.via : skipToken
  ) as { data: ArcOfCircleData | undefined };

  const { radius, angle } = useArcOfCircle(arcData);
  const { data: endPoint } = useGetCoordsQuery(
    arcData
      ? segment.from.handle === arcData.start.handle
        ? arcData.end
        : arcData.start
      : skipToken
  );

  useEffect(() => {
    if (arcData && radius && angle && endPoint) {
      setCommand(`A ${radius} ${radius} 0
        ${angle < 180 ? 0 : 1}
        ${segment.from.handle === arcData.start.handle ? 0 : 1}
        `);
    }
  }, [arcData, radius, angle, endPoint]);

  return command;
}

// function useCubicCommand(segment: Segment) {
//   const [command, setCommand] = useState("");
//   const { data: cubicData } = useGetEntityQuery(
//     segment.via.type === "Cubic" ? segment.via : skipToken
//   ) as { data: CubicData | undefined };

//   const { data: fromControl } = useGetCoordsQuery(
//     cubicData
//       ? segment.from.handle === cubicData.start_point.handle
//         ? cubicData.start_control
//         : cubicData.end_control
//       : skipToken
//   );
//   const { data: toControl } = useGetCoordsQuery(
//     cubicData
//       ? segment.from.handle === cubicData.start_point.handle
//         ? cubicData.end_control
//         : cubicData.start_control
//       : skipToken
//   );
//   const { data: lineTo } = useGetCoordsQuery(
//     cubicData
//       ? segment.from.handle === cubicData.start_point.handle
//         ? cubicData.end_point
//         : cubicData.start_point
//       : skipToken
//   );

//   useEffect(() => {
//     if (fromControl && toControl && lineTo) {
//       setCommand(`C ${fromControl.join(" ")},
//           ${toControl.join(" ")},
//           ${lineTo.join(" ")}`);
//     }
//   }, [fromControl, toControl, lineTo]);

//   return command;
// }

// function useLineCommand(segment: Segment) {
//   const [command, setCommand] = useState("");
//   const { data: lineData } = useGetEntityQuery(
//     segment.via.type === "LineSegment" ? segment.via : skipToken
//   ) as { data: LineSegmentData | undefined };

//   const { data: lineTo } = useGetCoordsQuery(
//     lineData
//       ? segment.from.handle === lineData.point_a.handle
//         ? lineData.point_b
//         : lineData.point_a
//       : skipToken
//   );

//   useEffect(() => {
//     if (lineTo) {
//       setCommand(`L ${lineTo.join(" ")}`);
//     }
//   }, [lineTo]);

//   return command;
// }
