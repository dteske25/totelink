import supabase from "../database/supabase";
import useAuth from "../hooks/useAuth";
import Button from "./Button";

export default function AuthButton() {
  const { session } = useAuth();
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return <Button onClick={handleLogout}>Logout</Button>;
  }
  return <Button onClick={handleLogin}>Login</Button>;
}
