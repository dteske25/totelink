import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton showName />;
  }

  return (
    <SignInButton mode="modal">
      <Button>Sign In</Button>
    </SignInButton>
  );
}
