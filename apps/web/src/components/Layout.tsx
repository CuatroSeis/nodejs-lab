import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";
import A11ySkipLink from "./A11ySkipLink";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <A11ySkipLink />
      <Sidebar />
      <div className="layout-main">
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
