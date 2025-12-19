import { Package, Menu as MenuIcon } from "lucide-react";
import { ThemePicker } from "./ThemePicker";
import { Link } from "@tanstack/react-router";
import AuthButton from "./AuthButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <div className="navbar bg-background border-b flex h-16 w-full items-center px-4">
      <div className="flex-1 flex items-center gap-2">
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link to="/totes" className="w-full">
                  List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/scan" className="w-full">
                  Scan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AuthButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link to="/" className="btn btn-ghost text-xl text-primary font-bold flex items-center gap-2">
          <Package className="h-6 w-6 stroke-primary" />
          Totelink
        </Link>
      </div>
      <div className="hidden flex-none md:flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link to="/totes">List</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/scan">Scan</Link>
          </Button>
        </div>
        <AuthButton />
      </div>
      <div className="flex-none ml-2">
        <ThemePicker />
      </div>
    </div>
  );
}
