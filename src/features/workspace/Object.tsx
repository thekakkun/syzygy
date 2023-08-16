import { useGetPathQuery } from "../../app/slvs/slvsObjectsSlice";
import { ObjectHandle } from "../../common/types";

export default function Object({ handle }: { handle: ObjectHandle }) {
  let { data: path } = useGetPathQuery(handle);

  return path?.type === "Circle" ? (
    <circle
      cx={path.data.center.coords[0]}
      cy={path.data.center.coords[1]}
      r={path.data.radius}
      stroke="black"
      strokeWidth={2}
      fillOpacity={0}
    ></circle>
  ) : path?.type === "Path" ? (
    <path
      d={path.data.join(" ")}
      stroke="black"
      strokeWidth={2}
      fillOpacity={0}
    ></path>
  ) : path?.type === "Shape" ? (
    <path
      d={path.data.join(" ") + "Z"}
      stroke="black"
      strokeWidth={2}
      fillOpacity={0}
    ></path>
  ) : (
    <></>
  );
}
