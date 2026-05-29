import { useEffect, useState } from 'react';
import { getBarColor } from '../utils/gradeConfig';

function ScoreBar({ label, score, icon, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const barColor = getBarColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 600 + delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="mb-4" data-testid={`score-bar-${label.toLowerCase().replace(/[^a-z]/g, '')}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-sm font-semibold" style={{ color: barColor }}>
          {score}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: barColor,
            transitionDuration: '800ms',
            transitionDelay: `${delay}ms`,
          }}
          data-testid="bar-fill"
        />
      </div>
    </div>
  );
}

export default function ScoreBreakdown({ co2Score, waterScore, packagingScore }) {
  return (
    <div data-testid="score-breakdown" className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-800">Sustainability Breakdown</h3>

      <ScoreBar label="CO₂ Footprint" score={co2Score} icon="☁️" delay={0} />
      <ScoreBar label="Water Usage" score={waterScore} icon="💧" delay={100} />
      <ScoreBar label="Packaging" score={packagingScore} icon="♻️" delay={200} />
    </div>
  );
}
