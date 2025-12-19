import { Link, useLocation } from "@tanstack/react-router";
import { Package, List, ScanLine, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemePicker } from "./ThemePicker";
import { useClerk } from "@clerk/clerk-react";

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useClerk();

  const navItems = [
    { href: "/totes", label: "Dashboard", icon: List },
    { href: "/scan", label: "Scan", icon: ScanLine },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Package className="h-6 w-6" />
          <span>Totelink</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                location.pathname === item.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center justify-between gap-4">
           <ThemePicker />
           <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
              <LogOut className="h-4 w-4" />
           </Button>
        </div>
      </div>
    </div>
  );
}
