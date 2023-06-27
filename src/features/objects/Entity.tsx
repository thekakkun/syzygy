import { EntityHandle } from "../../app/slvs/slvsEntitiesSlice";

export default function Entity({ entity }: { entity: EntityHandle }) {
  return <li>{`${entity.type} ${entity.handle}`}</li>;
}
