"use client";

import { AlignLeft } from "lucide-react";
import SideMenu from "./SideMenu";
import { useState } from "react";

const MobilMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkcolor hoverEffect md:hidden hover:cursor-pointer " />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};

export default MobilMenu;
