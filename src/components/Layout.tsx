import { Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
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
    <div className="h-screen bg-base-100">
      <Navbar />
      <div className="m-4">
        <Outlet />
      </div>
    </div>
  );
}
