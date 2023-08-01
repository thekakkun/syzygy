import style from "./App.module.css";
import Properties from "./features/properties/Properties";
import Status from "./features/status/Status";
import SlvsObjects from "./features/objects/Objects";
import Toolbar from "./features/toolbar/Toolbar";
import Workspace from "./features/workspace/Workspace";

function App() {
  return (
    <div className={style.app}>
      <Toolbar></Toolbar>
      <Workspace></Workspace>
      <Properties></Properties>
      <SlvsObjects></SlvsObjects>
      <Status></Status>
    </div>
  );
}

export default App;
