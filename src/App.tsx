import style from "./App.module.css";
import Properties from "./components/Properties";
import Status from "./components/Status";
import Objects from "./features/objects/Objects";
import Tools from "./features/tools/Tools";
import Workspace from "./features/workspace/Workspace";

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
