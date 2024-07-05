import { ReactNode } from "react";
import Resizeable from "../general/Resizeable";

interface SideBarBaseProps {
  minWidth?: number
  width?: number;
  close: () => void;
  header: ReactNode;
  content: ReactNode;
}

const SideBarBase = ({ minWidth, width = 500, close, header, content }: SideBarBaseProps) => {

  return (
    <Resizeable minWidth={minWidth} width={width}>
      <div className="resizeable-sidebar-container">
        <div className="resizeable-sidebar-toolbar">
          { header }

          <button onClick={close}>&#x2715;</button>
        </div>

        <div className="resizeable-sidebar-content">
          { content }
        </div>
      </div>
    </Resizeable>
  );
};

export default SideBarBase;
