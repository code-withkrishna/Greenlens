import { useState, useCallback } from 'react';

const STORAGE_KEY = 'greenlens_history';
const MAX_HISTORY = 10;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

export function useScanHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addScan = useCallback((scanResult) => {
    setHistory((prev) => {
      const entry = {
        ...scanResult,
        scannedAt: new Date().toISOString(),
        id: `${scanResult.product?.barcode}-${Date.now()}`,
      };
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addScan, clearHistory };
}
