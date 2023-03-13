import Canvas from "./components/Canvas";
import Tools from "./components/Tools";
import styles from "./App.module.css";
import Properties from "./components/Properties";
import Objects from "./components/Objects";

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
