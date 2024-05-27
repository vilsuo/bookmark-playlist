import { useState } from "react";
import { Album, SidebarType } from "../../types";
import Sidebar from "./Sidebar";
import SidebarOpener from "./opener/SidebarOpener";

interface SidebarContainerProps {
  albums: Album[];
}

const SidebarContainer = ({ albums }: SidebarContainerProps) => {
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
        albums={albums}
        scrollPos={scrollPos}
        setScrollPos={setScrollPos}
      />
    );
  }
};

export default SidebarContainer;
