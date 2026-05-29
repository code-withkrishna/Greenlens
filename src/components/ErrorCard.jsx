const ERROR_CONFIGS = {
  not_found: {
    icon: '🔍',
    title: 'Product not found',
    message: 'Try another barcode or check the number and try again.',
    buttonLabel: 'Try again',
  },
  api_error: {
    icon: '⚡',
    title: 'Scoring unavailable',
    message: 'Our AI scoring service is having a moment. Please try again shortly.',
    buttonLabel: 'Retry',
  },
  no_camera: {
    icon: '📷',
    title: 'Camera not supported',
    message: 'Camera scanning is not available on this browser. Please type the barcode manually.',
    buttonLabel: 'Type barcode',
  },
};

export default function ErrorCard({ type = 'api_error', onRetry }) {
  const config = ERROR_CONFIGS[type] ?? ERROR_CONFIGS.api_error;

  return (
    <div
      data-testid="error-card"
      className="mx-auto max-w-sm rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm"
    >
      <div className="mb-3 text-4xl">{config.icon}</div>
      <h3 className="mb-2 text-base font-semibold text-red-800" data-testid="error-title">
        {config.title}
      </h3>
      <p className="mb-5 text-sm text-red-600">{config.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-red-700 px-6 py-2 text-sm font-medium text-white hover:bg-red-800 active:scale-95 transition-transform"
          data-testid="retry-button"
        >
          {config.buttonLabel}
        </button>
      )}
    </div>
  );
}
