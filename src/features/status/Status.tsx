import { useAppSelector } from "../../app/store";
import style from "./Status.module.css";

export default function Status() {
  const {
    coord: [x, y],
  } = useAppSelector((state) => state.cursor);

  const { type, selection } = useAppSelector((state) => state.selection);

  return (
    <div className={style.status}>
      <p>
        ({x}, {y}) | {`${type}: ${selection}`}
      </p>
    </div>
  );
}
