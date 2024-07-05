import { useState } from "react";
import { SidebarType } from "../../types";
import Sidebar from "./Sidebar";
import SidebarOpener from "./opener/SidebarOpener";

const SidebarContainer = () => {
  // the current opened sidebar
  const [sidebarType, setSidebarType] = useState<SidebarType | null>(null);

  // remember sidebar scroll positions
  const [scrollPos, setScrollPos] = useState<Partial<Record<SidebarType, number>>>({});

  const addScrollPos = (type: SidebarType, pos: number | undefined) => {
    setScrollPos((positions) => ({
      ...positions,
      [type]: pos || 0,
    }));
  };

  const closeSidebar = () => setSidebarType(null);

  if (sidebarType === null) {
    return (
      <SidebarOpener
        show={setSidebarType}
      />
    );
  } else {
    return (
      <Sidebar
        sidebarType={sidebarType}
        close={closeSidebar}
        scrollPos={scrollPos}
        addScrollPos={addScrollPos}
      />
    );
  }
};

export default SidebarContainer;
