import { Package } from "lucide-react";
import { ThemePicker } from "./ThemePicker";
import { Link } from "./Link";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export function Navbar() {
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
              <LogoutButton />
              <LoginButton />
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
        <div className="hidden md:flex"></div>
        <ThemePicker />
      </div>
    </div>
  );
}
