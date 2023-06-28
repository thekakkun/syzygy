import { useAppSelector } from "../../app/store";
import style from "./Status.module.css";

export default function Status() {
  const {
    coord: [x, y],
  } = useAppSelector((state) => state.cursor);

  return (
    <div className={style.status}>
      <p>
        ({x}, {y})
      </p>
    </div>
  );
}
