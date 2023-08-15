import style from "./App.module.css";
import Properties from "./features/properties/Properties";
import Status from "./features/status/Status";
import Objects from "./features/objects/Objects";
import Toolbar from "./features/toolbar/Toolbar";
import Workspace from "./features/workspace/Workspace";
import { useGetEntityQuery } from "./app/slvs/slvsEntitiesSlice";
import { useEffect } from "react";

function App() {
  const { data: foo } = useGetEntityQuery({ type: "Circle", handle: 7 });
  useEffect(() => {
    console.log(foo);
  }, [foo]);
  return (
    <div className={style.app}>
      <Toolbar></Toolbar>
      <Workspace></Workspace>
      <Properties></Properties>
      <Objects></Objects>
      <Status></Status>
    </div>
  );
}

export default App;
