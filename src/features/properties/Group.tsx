import { useGetGroupsQuery } from "../../app/slvs/slvsGroupsSlice";

export default function Group({ handles }: { handles: number[] }) {
  switch (handles.length) {
    case 0:
      return <p>Nothing selected</p>;
    case 1:
      const { data: groups } = useGetGroupsQuery();
      const handle = handles[0];
      const groupData = groups?.[handle];
      return (
        <>
          <p>Group {handle}</p>
          {groupData && <p>{`${groupData.entities.length} entities`}</p>}
        </>
      );
    default:
      return <p>Groups {handles.join(", ")}</p>;
  }
}
