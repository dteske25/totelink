import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "@clerk/clerk-react";
import { ThemePicker } from "../components/ThemePicker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col gap-2 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
          <a href="#" className="font-semibold text-primary">General</a>
          <a href="#">Security</a>
          <a href="#">Integrations</a>
          <a href="#">Support</a>
          <a href="#">Organizations</a>
          <a href="#">Advanced</a>
        </nav>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h4 className="text-sm font-medium">Theme</h4>
                    <p className="text-sm text-muted-foreground">Select a color theme for the interface.</p>
                </div>
                <ThemePicker />
              </div>
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your user account.</CardDescription>
              </CardHeader>
              <CardContent>
                  <UserProfile 
                       appearance={{
                           elements: {
                               rootBox: "w-full shadow-none",
                               card: "shadow-none border-0 w-full bg-transparent p-0",
                               navbar: "hidden",
                               headerTitle: "hidden",
                               headerSubtitle: "hidden",
                               pageScrollBox: "p-0"
                           }
                       }}
                  />
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
