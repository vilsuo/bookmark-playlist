import { useState } from "react";

interface ResizeableProps {
  minWidth?: number;
  width: number;
  children: React.ReactNode;
};

// https://stackoverflow.com/a/62437093
const Resizeable = ({ minWidth = 0, width, children }: ResizeableProps) => {
  const [sizeX, setSizeX] = useState(width);

  const handler = (mouseDownEvent: React.MouseEvent) => {
    const startSizeX = sizeX;
    const startPosition = mouseDownEvent.pageX;
    
    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      setSizeX(//currentSize => ({
        Math.max(minWidth, startSizeX - startPosition + mouseMoveEvent.pageX)
      );
    }

    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }
    
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <div className="resizeable" style={{ width: sizeX }}>
      <div className="resizeable-container">
        { children }
      </div>

      <div id="draghandle" onMouseDown={handler} />
    </div>
  );
};

export default Resizeable;
