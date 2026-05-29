import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

export default function CameraScanner({ onDetected, onClose }) {
  const { videoRef, isScanning, isSupported, error, startScan, stopScan } =
    useBarcodeScanner(onDetected);

  if (!isSupported) {
    return (
      <div data-testid="camera-unsupported" className="rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-700">
        <p className="font-medium">Camera scanning not available</p>
        <p className="mt-1 text-xs">Please type the barcode manually.</p>
      </div>
    );
  }

  return (
    <div data-testid="camera-scanner" className="relative overflow-hidden rounded-2xl bg-black shadow-xl">
      <video
        ref={videoRef}
        className="h-64 w-full object-cover"
        playsInline
        muted
        data-testid="camera-video"
      />

      {/* Scan reticle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-48 rounded-lg border-2 border-green-400 opacity-80">
          <div className="absolute -left-0.5 -top-0.5 h-5 w-5 border-l-4 border-t-4 border-green-400 rounded-tl" />
          <div className="absolute -right-0.5 -top-0.5 h-5 w-5 border-r-4 border-t-4 border-green-400 rounded-tr" />
          <div className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-green-400 rounded-bl" />
          <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-green-400 rounded-br" />
        </div>
      </div>

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 p-2 text-center text-xs text-white">
          {error}
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex gap-2">
        {!isScanning ? (
          <button
            onClick={startScan}
            className="rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white"
            data-testid="start-scan-button"
          >
            Start scanning
          </button>
        ) : (
          <button
            onClick={stopScan}
            className="rounded-xl bg-gray-700 px-4 py-2 text-xs font-medium text-white"
            data-testid="stop-scan-button"
          >
            Stop
          </button>
        )}
        <button
          onClick={() => { stopScan(); onClose?.(); }}
          className="rounded-xl bg-white/20 px-4 py-2 text-xs font-medium text-white"
          data-testid="close-camera-button"
        >
          Close
        </button>
      </div>
    </div>
  );
}
