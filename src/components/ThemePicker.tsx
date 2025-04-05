import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Swap } from "./Swap";

export function ThemePicker() {
  const preferredTheme = window?.matchMedia?.("(prefers-color-scheme:dark)")
    ?.matches
    ? "dark"
    : "light";
  const [theme, setTheme] = useState(preferredTheme);

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      className="btn btn-ghost"
      onClick={() => {
        theme === "dark" ? setTheme("light") : setTheme("dark");
      }}
    >
      <Swap
        rotate
        active={theme === "dark"}
        activeState={<Sun />}
        inactiveState={<Moon />}
      />
    </div>
  );
}
