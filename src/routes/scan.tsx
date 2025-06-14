import { createFileRoute } from "@tanstack/react-router";

export function ScanRoute() {
  return <div>Hello "/scan"!</div>;
}

export const Route = createFileRoute("/scan")({
  component: ScanRoute,
});
