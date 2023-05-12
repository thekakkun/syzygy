import style from "./Status.module.css";
import { useAppSelector } from "../app/hooks";

export default function Status() {
  const [x, y] = useAppSelector((state) => state.canvas.pointer);

  return (
    <div className={style.status}>
      <p>
        ({x}, {y})
      </p>
    </div>
  );
}
