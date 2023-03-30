import styles from "./App.module.css";
import Canvas from "./components/Canvas";
import Objects from "./components/Objects";
import Properties from "./components/Properties";
import Tools from "./components/Tools";

function App() {
  return (
    <div className={styles.app}>
      <Tools></Tools>
      <Canvas></Canvas>
      <Properties></Properties>
      <Objects></Objects>
    </div>
  );
}

export default App;
