import style from "./Status.module.css";
import { useAppSelector } from "../app/hooks";

export default function Status() {
  const cursor = useAppSelector((state) => state.cursor);

  return (
    <div className={style.status}>
      <p>
        ({cursor.x}, {cursor.y})
      </p>
    </div>
  );
}
