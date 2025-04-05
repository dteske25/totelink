import { Outlet } from "@tanstack/react-router";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="h-screen bg-base-100">
      <Navbar />
      <div className="mx-8 my-4">
        <Outlet />
      </div>
    </div>
  );
}
