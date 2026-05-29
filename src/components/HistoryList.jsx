import { getGradeConfig } from '../utils/gradeConfig';
import { formatTimeAgo } from '../utils/formatProduct';
import { scoreToGrade } from '../utils/gradeConfig';

function GradeBadge({ grade }) {
  const config = getGradeConfig(grade);
  return (
    <div
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
      style={{ backgroundColor: config.bg, color: config.color }}
      data-testid="grade-badge"
    >
      {grade}
    </div>
  );
}

/**
 * HistoryStats — shows average grade and worst product across recent scans.
 * Turns GreenLens from a single-use scanner into a behaviour-change tracker.
 */
function HistoryStats({ history }) {
  if (history.length < 2) return null;

  const scores = history
    .map((e) => e.score?.overall_score)
    .filter((s) => typeof s === 'number');

  if (scores.length === 0) return null;

  const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  const avgGrade = scoreToGrade(avgScore);
  const avgConfig = getGradeConfig(avgGrade);

  const worstEntry = history.reduce((worst, entry) => {
    const s = entry.score?.overall_score ?? 100;
    const w = worst.score?.overall_score ?? 100;
    return s < w ? entry : worst;
  }, history[0]);

  return (
    <div
      className="rounded-xl bg-white p-3 shadow-sm mb-2"
      data-testid="history-stats"
    >
      <p className="text-xs text-gray-500">
        Your last {history.length} scans averaged{' '}
        <span
          className="font-bold rounded px-1"
          style={{ backgroundColor: avgConfig.bg, color: avgConfig.color }}
        >
          grade {avgGrade}
        </span>
        {worstEntry?.product?.name && (
          <>
            {' '}— biggest opportunity:{' '}
            <span className="font-medium text-gray-700">{worstEntry.product.name}</span>
          </>
        )}
      </p>
    </div>
  );
}

export default function HistoryList({ history = [], onSelect, onClear }) {
  if (history.length === 0) {
    return (
      <div data-testid="history-empty" className="py-8 text-center text-sm text-gray-400">
        <div className="mb-2 text-3xl">🌱</div>
        <p>No scans yet.</p>
        <p>Try scanning a product!</p>
      </div>
    );
  }

  return (
    <div data-testid="history-list">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recent scans</h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          data-testid="clear-history"
        >
          Clear
        </button>
      </div>

      <HistoryStats history={history} />

      <ul className="space-y-2">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              className="flex w-full items-center gap-3 rounded-xl bg-white p-3 shadow-sm hover:shadow-md transition-shadow text-left"
              onClick={() => onSelect?.(entry)}
              data-testid="history-item"
            >
              <GradeBadge grade={entry.score?.grade ?? 'F'} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {entry.product?.name ?? 'Unknown product'}
                </p>
                <p className="text-xs text-gray-400">{entry.product?.brand}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-300">
                {entry.scannedAt ? formatTimeAgo(entry.scannedAt) : ''}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
