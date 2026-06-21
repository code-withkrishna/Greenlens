import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GradeCard from './GradeCard';
import ScoreBreakdown from './ScoreBreakdown';
import ReasonList from './ReasonList';
import GreenSwaps from './GreenSwaps';
import ErrorCard from './ErrorCard';
import HistoryList from './HistoryList';
import BarcodeInput from './BarcodeInput';
import LoadingScreen from './LoadingScreen';

// ─── GradeCard ────────────────────────────────────────────────────────────────
describe('GradeCard', () => {
  it('renders grade letter', () => {
    render(<GradeCard productName="Nutella" brand="Ferrero" grade="D" gradeLabel="Poor" />);
    expect(screen.getByTestId('grade-letter')).toHaveTextContent('D');
  });

  it('renders product name and brand', () => {
    render(<GradeCard productName="Nutella" brand="Ferrero" grade="D" gradeLabel="Poor" />);
    expect(screen.getByTestId('product-name')).toHaveTextContent('Nutella');
    expect(screen.getByText('Ferrero')).toBeInTheDocument();
  });

  it('renders grade label badge', () => {
    render(<GradeCard productName="Nutella" brand="Ferrero" grade="D" gradeLabel="Poor" />);
    expect(screen.getByTestId('grade-label')).toHaveTextContent('Poor');
  });

  it('applies correct background color from grade config', () => {
    render(<GradeCard productName="Evian" brand="Danone" grade="A" gradeLabel="Excellent" />);
    const card = screen.getByTestId('grade-card');
    expect(card).toHaveStyle({ backgroundColor: '#EAF3DE' });
  });

  it('falls back gracefully for unknown grade', () => {
    render(<GradeCard productName="X" brand="Y" grade="Z" gradeLabel="Unknown" />);
    expect(screen.getByTestId('grade-card')).toBeInTheDocument();
  });
});

// ─── ScoreBreakdown ──────────────────────────────────────────────────────────
describe('ScoreBreakdown', () => {
  it('renders three score bars', () => {
    render(<ScoreBreakdown co2Score={70} waterScore={85} packagingScore={50} />);
    expect(screen.getByTestId('score-breakdown')).toBeInTheDocument();
    expect(screen.getByText('CO₂ Footprint')).toBeInTheDocument();
    expect(screen.getByText('Water Usage')).toBeInTheDocument();
    expect(screen.getByText('Packaging')).toBeInTheDocument();
  });

  it('displays correct score values', () => {
    render(<ScoreBreakdown co2Score={70} waterScore={85} packagingScore={50} />);
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('shows section heading', () => {
    render(<ScoreBreakdown co2Score={70} waterScore={85} packagingScore={50} />);
    expect(screen.getByText('Sustainability Breakdown')).toBeInTheDocument();
  });
});

// ─── ReasonList ──────────────────────────────────────────────────────────────
describe('ReasonList', () => {
  const reasons = ['Palm oil.', 'Ultra-processed.', 'High emissions.'];

  it('renders all reasons', () => {
    render(<ReasonList reasons={reasons} />);
    const items = screen.getAllByTestId('reason-item');
    expect(items).toHaveLength(3);
  });

  it('renders each reason text', () => {
    render(<ReasonList reasons={reasons} />);
    expect(screen.getByText('Palm oil.')).toBeInTheDocument();
    expect(screen.getByText('Ultra-processed.')).toBeInTheDocument();
  });

  it('renders empty list without crashing', () => {
    render(<ReasonList reasons={[]} />);
    expect(screen.queryAllByTestId('reason-item')).toHaveLength(0);
  });

  it('renders without reasons prop', () => {
    render(<ReasonList />);
    expect(screen.getByTestId('reason-list')).toBeInTheDocument();
  });
});

// ─── GreenSwaps ──────────────────────────────────────────────────────────────
describe('GreenSwaps', () => {
  const swaps = [
    { name: 'Pip & Nut', why: 'No palm oil.', estimated_grade: 'B' },
    { name: 'Whole Earth', why: 'Single ingredient.', estimated_grade: 'A' },
  ];

  it('renders all swap cards', () => {
    render(<GreenSwaps swaps={swaps} />);
    expect(screen.getAllByTestId('swap-card')).toHaveLength(2);
  });

  it('shows swap names and reasoning', () => {
    render(<GreenSwaps swaps={swaps} />);
    expect(screen.getByText('Pip & Nut')).toBeInTheDocument();
    expect(screen.getByText('No palm oil.')).toBeInTheDocument();
  });

  it('shows estimated grade badges', () => {
    render(<GreenSwaps swaps={swaps} />);
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders with empty swaps', () => {
    render(<GreenSwaps swaps={[]} />);
    expect(screen.getByTestId('green-swaps')).toBeInTheDocument();
  });
});

// ─── ErrorCard ───────────────────────────────────────────────────────────────
describe('ErrorCard', () => {
  it('renders not_found error', () => {
    render(<ErrorCard type="not_found" />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Product not found');
  });

  it('renders api_error', () => {
    render(<ErrorCard type="api_error" />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Scoring unavailable');
  });

  it('renders no_camera error', () => {
    render(<ErrorCard type="no_camera" />);
    expect(screen.getByTestId('error-title')).toHaveTextContent('Camera not supported');
  });

  it('calls onRetry when button clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorCard type="not_found" onRetry={onRetry} />);
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when onRetry not provided', () => {
    render(<ErrorCard type="api_error" />);
    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument();
  });
});

// ─── HistoryList ─────────────────────────────────────────────────────────────
describe('HistoryList', () => {
  const history = [
    {
      id: 'test-1',
      scannedAt: new Date().toISOString(),
      product: { barcode: '123', name: 'Nutella', brand: 'Ferrero' },
      score: { grade: 'D' },
    },
    {
      id: 'test-2',
      scannedAt: new Date().toISOString(),
      product: { barcode: '456', name: 'Evian', brand: 'Danone' },
      score: { grade: 'B' },
    },
  ];

  it('shows empty state when no history', () => {
    render(<HistoryList history={[]} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
  });

  it('renders history items', () => {
    render(<HistoryList history={history} />);
    expect(screen.getAllByTestId('history-item')).toHaveLength(2);
  });

  it('shows product names', () => {
    render(<HistoryList history={history} />);
    expect(screen.getByText('Nutella')).toBeInTheDocument();
    expect(screen.getByText('Evian')).toBeInTheDocument();
  });

  it('calls onSelect when history item clicked', () => {
    const onSelect = vi.fn();
    render(<HistoryList history={history} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId('history-item')[0]);
    expect(onSelect).toHaveBeenCalledWith(history[0]);
  });

  it('calls onClear when clear button clicked', () => {
    const onClear = vi.fn();
    render(<HistoryList history={history} onClear={onClear} />);
    fireEvent.click(screen.getByTestId('clear-history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('shows grade badges', () => {
    render(<HistoryList history={history} />);
    expect(screen.getAllByTestId('grade-badge')).toHaveLength(2);
  });
});

// ─── BarcodeInput ────────────────────────────────────────────────────────────
describe('BarcodeInput', () => {
  it('renders input and submit button', () => {
    render(<BarcodeInput onSubmit={vi.fn()} isCameraSupported={false} />);
    expect(screen.getByTestId('barcode-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('submit button disabled when input empty', () => {
    render(<BarcodeInput onSubmit={vi.fn()} isCameraSupported={false} />);
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('submit button enabled when input has value', () => {
    render(<BarcodeInput onSubmit={vi.fn()} isCameraSupported={false} />);
    fireEvent.change(screen.getByTestId('barcode-input'), { target: { value: '3017620422003' } });
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('calls onSubmit with trimmed barcode on form submit', () => {
    const onSubmit = vi.fn();
    render(<BarcodeInput onSubmit={onSubmit} isCameraSupported={false} />);
    fireEvent.change(screen.getByTestId('barcode-input'), { target: { value: '  123456  ' } });
    fireEvent.submit(screen.getByTestId('barcode-form'));
    expect(onSubmit).toHaveBeenCalledWith('123456');
  });

  it('clears input after submit', () => {
    render(<BarcodeInput onSubmit={vi.fn()} isCameraSupported={false} />);
    const input = screen.getByTestId('barcode-input');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.submit(screen.getByTestId('barcode-form'));
    expect(input).toHaveValue('');
  });

  it('shows camera button when supported', () => {
    render(<BarcodeInput onSubmit={vi.fn()} onCameraClick={vi.fn()} isCameraSupported={true} />);
    expect(screen.getByTestId('camera-button')).toBeInTheDocument();
  });

  it('calls onCameraClick when camera button pressed', () => {
    const onCameraClick = vi.fn();
    render(<BarcodeInput onSubmit={vi.fn()} onCameraClick={onCameraClick} isCameraSupported={true} />);
    fireEvent.click(screen.getByTestId('camera-button'));
    expect(onCameraClick).toHaveBeenCalledTimes(1);
  });
});

// ─── LoadingScreen ───────────────────────────────────────────────────────────
describe('LoadingScreen', () => {
  it('renders loading screen', () => {
    render(<LoadingScreen />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('shows initial loading message', () => {
    render(<LoadingScreen />);
    expect(screen.getByTestId('loading-message')).toBeInTheDocument();
    expect(screen.getByTestId('loading-message').textContent).toBeTruthy();
  });
});
