import { Link as RouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import { ReactNode } from "react";
import { FileRoutesByTo } from "../routeTree.gen";

interface ILinkProps {
  to: keyof FileRoutesByTo;
  className?: string;
  children: ReactNode;
}

export function Link({ to, className, children }: ILinkProps) {
  return (
    <RouterLink
      activeProps={{ className: "font-bold" }}
      className={clsx("btn", "btn-ghost", className)}
      to={to}
    >
      {children}
    </RouterLink>
  );
}
