import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function AuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <button className="btn btn-primary">Sign In</button>
    </SignInButton>
  );
}
