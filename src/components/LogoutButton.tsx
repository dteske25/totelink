import { useAuth0 } from "@auth0/auth0-react";

interface ILogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: ILogoutButtonProps) => {
  const { logout } = useAuth0();

  return (
    <button className={className} onClick={() => logout()}>
      Log Out
    </button>
  );
};

export default LogoutButton;
