import {
  ObjectHandle,
  useGetObjectQuery,
} from "../../app/slvs/slvsObjectsSlice";
import { usePathData } from "../../common/hooks/usePathData";

export default function SlvsObject({
  objectHandle,
}: {
  objectHandle: ObjectHandle;
}) {
  let { data: segments } = useGetObjectQuery(objectHandle);
  let pathData = usePathData(segments);

  console.log(pathData);

  return (
    <path
      // d={
      //   // pathCommands &&
      //   // pathCommands
      //   //   .map(({ moveTo, line, closePath }) =>
      //   //     [moveTo, line, closePath].join(" ")
      //   //   )
      //   //   .join(" ")
      //   ""
      // }
      stroke="black"
      strokeWidth={2}
      fillOpacity={0}
    ></path>
  );
}
