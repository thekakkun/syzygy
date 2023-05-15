import { useAppSelector } from "../app/store";
import style from "./Status.module.css";

export default function Status() {
  const {
    pointer: [x, y],
    mode,
  } = useAppSelector((state) => state.workspace);

  return (
    <div className={style.status}>
      <p>
        ({x}, {y}) | {mode}
      </p>
    </div>
  );
}
