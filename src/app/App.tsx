import Objects from "../components/Objects";
import Properties from "../components/Properties";
import Status from "../components/Status";
import Tools from "../components/Tools";
import Workspace from "../features/workspace/Workspace";

import style from "./App.module.css";

function App() {
  return (
    <div className={style.app}>
      <Tools></Tools>
      <Workspace></Workspace>
      <Properties></Properties>
      <Objects></Objects>
      <Status></Status>
    </div>
  );
}

export default App;
