import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scan")({
  component: ScanRoute,
});

function ScanRoute() {
  return <div>Hello "/scan"!</div>;
}
