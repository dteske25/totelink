import { useAuth0 } from "@auth0/auth0-react";

interface ILoginButtonProps {
  className?: string;
}

const LoginButton = ({ className }: ILoginButtonProps) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className={className} onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default LoginButton;
