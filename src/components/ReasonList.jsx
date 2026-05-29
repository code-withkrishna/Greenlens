export default function ReasonList({ reasons = [] }) {
  return (
    <div data-testid="reason-list" className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-gray-800">Why this grade?</h3>
      <ul className="space-y-2">
        {reasons.map((reason, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-gray-600"
            data-testid="reason-item"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="mt-0.5 flex-shrink-0 text-base">
              {i === 0 ? '⚠️' : i === 1 ? '🔍' : '📊'}
            </span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
