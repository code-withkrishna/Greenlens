import { useEffect, useState } from 'react';

const MESSAGES = [
  'Analyzing environmental impact...',
  'Running two-stage AI scoring...',
  'Calculating your carbon footprint...',
  'Checking packaging and supply chain...',
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-testid="loading-screen"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
    >
      <div
        className="text-5xl"
        style={{
          animation: 'spin 1s linear infinite',
          display: 'inline-block',
        }}
      >
        🌿
      </div>

      <p
        className="text-base font-medium text-gray-600 transition-all duration-500"
        data-testid="loading-message"
      >
        {MESSAGES[msgIndex]}
      </p>

      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-green-600"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
