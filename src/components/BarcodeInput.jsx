import { useState } from 'react';

export default function BarcodeInput({ onSubmit, onCameraClick, isCameraSupported }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="barcode-form" className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type or paste barcode..."
            inputMode="numeric"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            data-testid="barcode-input"
            aria-label="Barcode number"
          />

          {isCameraSupported !== false && (
            <button
              type="button"
              onClick={onCameraClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition-colors"
              aria-label="Scan with camera"
              data-testid="camera-button"
            >
              📷
            </button>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!value.trim()}
        className="mt-3 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white shadow-md hover:bg-green-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="submit-button"
      >
        Scan Product 🌿
      </button>
    </form>
  );
}
