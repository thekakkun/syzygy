import style from "./App.module.css";
import Properties from "./components/Properties";
import Status from "./components/Status";
import Objects from "./features/objects/Objects";
import Toolbar from "./features/toolbar/Toolbar";
import Workspace from "./features/workspace/Workspace";

function App() {
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
