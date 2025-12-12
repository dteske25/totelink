import { useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToteQRCodeProps {
  toteId: string;
  toteName: string;
}

export function ToteQRCode({ toteId, toteName }: ToteQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate the URL for the tote
  const toteUrl = `${window.location.origin}/totes/${toteId}`;

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(toteUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = `${toteName || `tote-${toteId}`}-qr-code.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {!showQR ? (
        <Button
          onClick={generateQRCode}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <QrCode className="size-4 mr-2" />
          {isGenerating ? "Generating..." : "Get QR Code"}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="inline-block rounded-lg border-2 border-border bg-white p-3">
              <img
                src={qrCodeUrl}
                alt={`QR Code for ${toteName || `Tote ${toteId}`}`}
                className="block h-32 w-32"
              />
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground/60">
            <p>Scan to access this tote</p>
            <p className="mt-1 font-mono text-[10px] break-all opacity-60">
              {toteUrl}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={downloadQRCode}
              variant="default"
              size="sm"
              className="w-full flex-1"
            >
              <Download className="mr-2 size-4" />
              Download
            </Button>
            <Button
              onClick={() => setShowQR(false)}
              variant="ghost"
              size="sm"
              className="px-2"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
