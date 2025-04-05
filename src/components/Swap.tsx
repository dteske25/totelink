import clsx from "clsx";
import { ReactNode } from "react";

interface ISwapProps {
  active?: boolean;
  rotate?: boolean;
  activeState: ReactNode;
  inactiveState: ReactNode;
}

export function Swap({
  rotate,
  active,
  activeState,
  inactiveState,
}: ISwapProps) {
  return (
    <div
      className={clsx("swap", {
        "swap-active": active,
        "swap-rotate": rotate,
      })}
    >
      <span className="swap-on">{activeState}</span>
      <span className="swap-off">{inactiveState}</span>
    </div>
  );
}
