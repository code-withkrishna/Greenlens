import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeInput from '../components/BarcodeInput';
import CameraScanner from '../components/CameraScanner';
import HistoryList from '../components/HistoryList';
import LoadingScreen from '../components/LoadingScreen';
import ErrorCard from '../components/ErrorCard';
import { useScanHistory } from '../hooks/useScanHistory';
import { fetchProduct } from '../api/openFoodFacts';
import { scoreProduct } from '../api/groqScore';
import { getCachedScan, setCachedScan } from '../utils/scanCache';

export default function Home() {
  const navigate = useNavigate();
  const { history, addScan, clearHistory } = useScanHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  async function handleBarcode(barcode) {
    setError(null);
    setLoading(true);
    setShowCamera(false);

    try {
      // Check cache first — avoids redundant API calls for repeated scans
      const cached = getCachedScan(barcode);
      if (cached) {
        addScan(cached);
        navigate('/result', { state: cached });
        return;
      }

      const product = await fetchProduct(barcode);
      const score = await scoreProduct(product);
      const result = { product, score };

      // Cache the result so re-scanning the same product is instant
      setCachedScan(barcode, result);
      addScan(result);
      navigate('/result', { state: result });
    } catch (err) {
      if (err.message === 'Product not found') {
        setError('not_found');
      } else {
        setError('api_error');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleHistorySelect(entry) {
    navigate('/result', { state: { product: entry.product, score: entry.score } });
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="py-6 space-y-6" data-testid="home-page">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-900 leading-snug">
          Know the planet cost<br />of what you buy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Scan a barcode for an instant eco grade
        </p>
      </div>

      {/* Camera scanner */}
      {showCamera && (
        <CameraScanner
          onDetected={handleBarcode}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Input */}
      <BarcodeInput
        onSubmit={handleBarcode}
        onCameraClick={() => setShowCamera((v) => !v)}
        isCameraSupported={true}
      />

      {/* Error */}
      {error && (
        <ErrorCard
          type={error}
          onRetry={() => setError(null)}
        />
      )}

      {/* History */}
      <HistoryList
        history={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />
    </div>
  );
}
