import { getGradeConfig } from '../utils/gradeConfig';

function SwapCard({ swap }) {
  const config = getGradeConfig(swap.estimated_grade);

  return (
    <div
      data-testid="swap-card"
      className="relative rounded-xl border-l-4 bg-gray-50 p-4"
      style={{ borderLeftColor: '#3B6D11' }}
    >
      <div className="absolute right-3 top-3">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {swap.estimated_grade}
        </span>
      </div>

      <div className="flex items-start gap-2 pr-8">
        <span className="mt-0.5 text-green-700">🌿</span>
        <div>
          <p className="text-sm font-medium text-gray-800">{swap.name}</p>
          <p className="mt-1 text-xs text-gray-500">{swap.why}</p>
        </div>
      </div>
    </div>
  );
}

export default function GreenSwaps({ swaps = [] }) {
  return (
    <div data-testid="green-swaps" className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-gray-800">Better choices to look for</h3>
      <div className="space-y-3">
        {swaps.map((swap, i) => (
          <SwapCard key={i} swap={swap} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        ⚠️ Swap suggestions are AI estimates — verify availability before purchasing.
      </p>
    </div>
  );
}
