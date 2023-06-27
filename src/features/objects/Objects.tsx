import style from "./Objects.module.css";

import {
  GroupData,
  useAddGroupMutation,
  useGetGroupsQuery,
} from "../../app/slvs/slvsGroupsSlice";
import Group from "./Group";

export default function Objects() {
  const { data: groups } = useGetGroupsQuery();
  const [addGroup] = useAddGroupMutation();

  return (
    <div className={style.objects}>
      <button onClick={() => addGroup()}>add group</button>
      {groups && (
        <ul>
          {Object.entries(groups).map(
            ([handle, elements]) => (
              <Group
                key={`group_${handle}`}
                handle={handle as unknown as number}
                entities={(elements as unknown as GroupData).entities}
              ></Group>
            )

            // {
            //   return (
            //     <li key={`group_${handle}`}>
            //       Group {handle as unknown as number}
            //       <ul>
            //         {(elements as unknown as GroupData).entities.map(
            //           (entity_handle) => {
            //             return (
            //               <li>{`${entity_handle.type} ${entity_handle.handle}`}</li>
            //             );
            //           }
            //         )}
            //       </ul>
            //     </li>
            //   );
            // }
          )}
        </ul>
      )}

      {/* <ul>
        {Object.entries(groups ?? {}).map(([handle, elements]) => {
          return <li>{handle}</li>;
        })}
      </ul> */}

      {/* <ul>
        {groups?.map((group) => {
          return <Group key={`group_${group}`} group={group}></Group>;
        })}
      </ul> */}
    </div>
  );
}
