import style from "./Status.module.css";
import { useAppSelector } from "../app/hooks";
import { useEffect } from "react";

export default function Status() {
  const canvas = useAppSelector((state) => state.canvas);
  useEffect(() => {
    console.log(canvas);
  }, [canvas]);

  return (
    <div className={style.status}>
      <p>
        ({canvas.pointer.x}, {canvas.pointer.y})
      </p>
    </div>
  );
}
