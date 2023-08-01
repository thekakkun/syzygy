import { useGetObjectQuery } from "../../app/slvs/slvsObjectsSlice";

export default function SlvsObject({ handles }: { handles: number[] }) {
  switch (handles.length) {
    case 0:
      return <p>Nothing selected</p>;
    case 1:
      const handle = handles[0];
      const { data: object } = useGetObjectQuery(handle);

      if (!object) {
        return <p>Object not found</p>;
      }

      const lastSegmentType = object[object?.length - 1].via.type;
      return (
        <>
          <p>Thingy {handle}</p>
          <p>
            Type:{" "}
            {lastSegmentType === "Circle"
              ? "circle"
              : lastSegmentType === "Close"
              ? "shape"
              : "path"}
          </p>
        </>
      );
    default:
      return <p>Thingies {handles.join(", ")}</p>;
  }
}
