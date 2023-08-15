import { useGetObjectQuery } from "../../app/slvs/slvsObjectsSlice";

export default function Object({ handles }: { handles: number[] }) {
  switch (handles.length) {
    case 0:
      return <p>Nothing selected</p>;
    case 1:
      const handle = handles[0];
      const { data: object } = useGetObjectQuery(handle);

      if (!object) {
        return <p>Object not found</p>;
      }

      return (
        <>
          <p>Thingy {handle}</p>
          <p>Type: {object.type}</p>
        </>
      );
    default:
      return <p>Thingies {handles.join(", ")}</p>;
  }
}
