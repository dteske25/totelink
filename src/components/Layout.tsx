import { Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import useAuth from "../hooks/useAuth";
import { RedirectToSignIn } from "@clerk/clerk-react";

export function Layout() {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn && location.pathname !== "/") {
    return <RedirectToSignIn />;
  }

  if (isSignedIn && location.pathname === "/") {
    return <Navigate to="/totes" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-base-100">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <Sidebar />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="md:hidden">
            <Navbar />
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
