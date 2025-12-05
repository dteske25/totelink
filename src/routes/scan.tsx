
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/scan")({
  component: ScanRoute,
});

function ScanRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const handleScan = (rawValue: string) => {
    if (paused || !rawValue) return;

    try {
      // The QR code contains the full URL (e.g., https://totelink.com/totes/{id})
      // We want to extract the tote ID
      const url = new URL(rawValue);
      const match = url.pathname.match(/\/totes\/([a-zA-Z0-9-]+)/);

      if (match && match[1]) {
        setPaused(true);
        navigate({ to: `/totes/${match[1]}` });
      } else {
        // If it's not a URL, maybe it's just the ID?
        // Let's assume for now valid QR codes are full URLs as per ToteQRCode.tsx
        // But for robustness, if it looks like a UUID, we could try that too.
        if (
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
            rawValue,
          )
        ) {
          setPaused(true);
          navigate({ to: `/totes/${rawValue}` });
          return;
        }
        setError("Invalid QR Code. Please scan a valid ToteLink QR code.");
      }
    } catch (e) {
      console.error(e);
      // If parsing fails, check if it is a UUID
      if (
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
          rawValue,
        )
      ) {
        setPaused(true);
        navigate({ to: `/totes/${rawValue}` });
        return;
      }
      setError("Invalid content. Please scan a valid ToteLink QR code.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Scan Tote QR Code</h1>
        <p className="text-base-content/70">
          Point your camera at a tote's QR code.
        </p>
      </div>

      <div className="bg-base-200 relative aspect-square w-full max-w-sm overflow-hidden rounded-xl border-2 border-primary/20 shadow-lg">
        <Scanner
          onScan={(result) => {
            if (result && result.length > 0) {
              handleScan(result[0].rawValue);
            }
          }}
          onError={(error) => {
            console.error(error);
            setError(
              "Camera error. Please ensure you have granted camera permissions.",
            );
          }}
          components={{
            finder: true,
          }}
          styles={{
            container: {
              width: "100%",
              height: "100%",
            },
            video: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 text-center text-white">
            <div className="space-y-4">
              <AlertCircle className="text-error mx-auto size-12" />
              <p className="text-error font-medium">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setPaused(false);
                }}
                className="btn btn-ghost btn-sm text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate({ to: "/totes" })}
          className="btn btn-ghost gap-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
