import { useState, useRef, useCallback } from 'react';

export function useBarcodeScanner(onDetected) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && 'BarcodeDetector' in window;

  const stopScan = useCallback(() => {
    clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    if (!isSupported) {
      setError('Camera scanning not supported on this browser. Please type the barcode manually.');
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      detectorRef.current = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
      });

      setIsScanning(true);

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const barcodes = await detectorRef.current.detect(videoRef.current);
          if (barcodes.length > 0) {
            stopScan();
            onDetected(barcodes[0].rawValue);
          }
        } catch {
          // Frame detection errors are normal, keep scanning
        }
      }, 300);
    } catch {
      setError('Could not access camera. Please allow camera permission or type the barcode.');
    }
  }, [isSupported, onDetected, stopScan]);

  return { videoRef, isScanning, isSupported, error, startScan, stopScan };
}
