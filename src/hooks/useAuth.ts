import { useUser, useSession } from "@clerk/clerk-react";

export default function useAuth() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();

  return {
    session,
    user,
    isLoaded: isUserLoaded && isSessionLoaded,
    isSignedIn: !!user,
  };
}
