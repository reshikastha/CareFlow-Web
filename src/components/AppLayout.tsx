import { type ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="app-layout">
      <div className={showSidebar ? "sidebar-wrapper show" : "sidebar-wrapper"}>
        <Sidebar />
      </div>

      {showSidebar && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close menu"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="main-container">
        <Header onMenuClick={() => setShowSidebar(true)} />
        {children}
      </div>
    </div>
  );
}

export default AppLayout;