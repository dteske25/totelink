import { Package } from "lucide-react";
import { ThemePicker } from "./ThemePicker";
import { Link } from "./Link";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <Link to="/totes">List</Link>
            </li>
            <li>
              <Link to="/scan">Scan</Link>
            </li>
            <li>
              {isAuthenticated ? (
                <LogoutButton className="btn btn-ghost" />
              ) : (
                <LoginButton className="btn btn-ghost" />
              )}
            </li>
          </ul>
        </div>
        <Link to="/" className="btn text-xl text-primary btn-ghost">
          <Package className="stroke-primary" />
          Totelink
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/totes">List</Link>
          </li>
          <li>
            <Link to="/scan">Scan</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="hidden md:flex">
          {!isAuthenticated && <LoginButton className="btn btn-primary" />}
          {isAuthenticated && (
            <div className="dropdown">
              <button role="button" className="btn btn-ghost">
                {user?.name ?? "Me"}
              </button>
              <ul className="dropdown-content menu w-30 rounded-box bg-base-300 p-2 shadow-sm">
                <li>
                  <LogoutButton className="btn btn-ghost" />
                </li>
              </ul>
            </div>
          )}
        </div>
        <ThemePicker />
      </div>
    </div>
  );
}
