import { SignUp } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm space-y-4">
            <SignUp 
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-none border w-full",
                        headerTitle: "text-2xl font-bold tracking-tight",
                        headerSubtitle: "text-muted-foreground",
                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                        footerActionLink: "text-primary hover:text-primary/90"
                    }
                }}
                signInUrl="/login"
            />
        </div>
    </div>
  );
}
