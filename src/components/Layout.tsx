import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export function Layout() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session?.user && location.pathname !== "/") {
      navigate({ to: "/" });
    }
    if (session?.user && location.pathname === "/") {
      navigate({ to: "/totes" });
    }
  }, [session, navigate, location.pathname]);

  return (
    <div className="h-screen bg-base-100">
      <Navbar />
      <div className="m-4">
        <Outlet />
      </div>
    </div>
  );
}
