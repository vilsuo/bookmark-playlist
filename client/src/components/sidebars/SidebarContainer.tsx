import { useState } from "react";
import { SidebarType } from "../../types";
import Sidebar from "./Sidebar";
import SidebarOpener from "./opener/SidebarOpener";

const SidebarContainer = () => {
  // the current opened sidebar
  const [sidebarType, setSidebarType] = useState<SidebarType | null>(null);

  const [scrollPos, setScrollPos] = useState(0);

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
        setScrollPos={setScrollPos}
      />
    );
  }
};

export default SidebarContainer;
