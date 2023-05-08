import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { invoke } from "@tauri-apps/api";

async function main() {
  try {
    await invoke("init_canvas");
  } catch (e) {
    console.log(e);
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );
}
main();
