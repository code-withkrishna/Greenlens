import { useEffect, useState } from 'react';
import { getGradeConfig } from '../utils/gradeConfig';

export default function GradeCard({ productName, brand, grade, gradeLabel }) {
  const [animate, setAnimate] = useState(false);
  const config = getGradeConfig(grade);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, [grade]);

  return (
    <div
      data-testid="grade-card"
      className="rounded-2xl p-6 text-center shadow-lg"
      style={{ backgroundColor: config.bg }}
    >
      <div
        data-testid="grade-letter"
        className="grade-letter mx-auto"
        style={{
          color: config.color,
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.3)',
          transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'block',
        }}
      >
        {grade}
      </div>

      <h2
        className="mt-2 text-lg font-semibold leading-tight"
        style={{ color: config.color }}
        data-testid="product-name"
      >
        {productName}
      </h2>

      <p className="mt-1 text-sm opacity-70" style={{ color: config.color }}>
        {brand}
      </p>

      <span
        className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-medium"
        style={{ backgroundColor: config.color, color: config.bg }}
        data-testid="grade-label"
      >
        {gradeLabel || config.label}
      </span>

      <p className="mt-2 text-xs opacity-60" style={{ color: config.color }}>
        {config.description}
      </p>
    </div>
  );
}
