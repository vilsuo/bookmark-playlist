import { ReactNode, useEffect, useRef } from "react";
import Resizeable from "../general/Resizeable";

interface SideBarBaseProps {
  width?: number;
  close: (pos: number | undefined) => void;
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  pos?: number;
};

const SideBarBase = (
  { width = 500, close, header, content, pos = 0, footer }: SideBarBaseProps
) => {

  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: pos, behavior: 'instant' });
  }, [pos]);

  const getScrollPosition = () => {
    return ref.current?.scrollTop;
  };

  return (
    <Resizeable width={width}>
      <div className="resizeable-sidebar">
        <div className="resizeable-sidebar-toolbar">
          { header }

          <button onClick={() => close(getScrollPosition())}>
            &#x2715;
          </button>
        </div>

        <div className="resizeable-sidebar-content" ref={ref}>
          { content }
        </div>

        <div className="resizeable-sidebar-footer">
          { footer }
        </div>
      </div>
    </Resizeable>
  );
};

export default SideBarBase;
