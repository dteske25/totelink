import { ReactNode } from "react";

interface IButtonProps {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

const Button = ({
  onClick,
  className = "btn btn-ghost",
  children,
}: IButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
