import style from "./Status.module.css";
import { useAppSelector } from "../app/hooks";

export default function Status() {
  const pointer = useAppSelector((state) => state.canvas.pointer);

  return (
    <div className={style.status}>
      <p>
        ({pointer.x}, {pointer.y})
      </p>
    </div>
  );
}
