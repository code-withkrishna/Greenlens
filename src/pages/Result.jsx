import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import GradeCard from '../components/GradeCard';
import ScoreBreakdown from '../components/ScoreBreakdown';
import ReasonList from '../components/ReasonList';
import GreenSwaps from '../components/GreenSwaps';
import ShareButton from '../components/ShareButton';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    if (!state?.product || !state?.score) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.product || !state?.score) return null;

  const { product, score } = state;

  return (
    <div className="space-y-4 pb-8 pt-4" data-testid="result-page">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 transition-colors"
        data-testid="back-link"
      >
        ← Back to scan
      </Link>

      {/* Grade card */}
      <div className="fade-up" style={{ animationDelay: '0ms' }}>
        <GradeCard
          productName={product.name}
          brand={product.brand}
          grade={score.grade}
          gradeLabel={score.grade_label}
        />
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI-powered score · <Link to="/about" className="underline hover:text-green-700 transition-colors">methodology</Link>
        </p>
      </div>

      {/* Score breakdown */}
      <div className="fade-up" style={{ animationDelay: '100ms' }}>
        <ScoreBreakdown
          co2Score={score.co2_score}
          waterScore={score.water_score}
          packagingScore={score.packaging_score}
        />
      </div>

      {/* Reasons */}
      <div className="fade-up" style={{ animationDelay: '200ms' }}>
        <ReasonList reasons={score.reasons} />
      </div>

      {/* Green swaps */}
      <div className="fade-up" style={{ animationDelay: '300ms' }}>
        <GreenSwaps swaps={score.greener_swaps} />
      </div>

      {/* Actions row: share + scan another */}
      <div className="fade-up flex items-center gap-3 pt-2" style={{ animationDelay: '400ms' }}>
        <ShareButton product={product} score={score} />
        <Link
          to="/"
          className="flex-1 rounded-xl border-2 border-green-700 py-3 text-center text-sm font-semibold text-green-700 hover:bg-green-700 hover:text-white transition-all"
          data-testid="scan-another"
        >
          Scan another product 🌿
        </Link>
      </div>
    </div>
  );
}
