import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Result from './Result';
import About from './About';

// ─── Result Page ─────────────────────────────────────────────────────────────
const mockState = {
  product: {
    barcode: '3017620422003',
    name: 'Nutella',
    brand: 'Ferrero',
    category: 'spreads',
  },
  score: {
    grade: 'D',
    overall_score: 35,
    co2_score: 28,
    water_score: 40,
    packaging_score: 38,
    grade_label: 'Poor',
    reasons: ['Palm oil.', 'Ultra-processed.', 'High emissions.'],
    greener_swaps: [
      { name: 'Pip & Nut', why: 'No palm oil.', estimated_grade: 'B' },
    ],
  },
};

function renderResultWithState(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/result', state }]}>
      <Routes>
        <Route path="/result" element={<Result />} />
        <Route path="/" element={<div data-testid="home-redirect">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Result page', () => {
  it('renders all result sections', () => {
    renderResultWithState(mockState);
    expect(screen.getByTestId('result-page')).toBeInTheDocument();
    expect(screen.getByTestId('grade-card')).toBeInTheDocument();
    expect(screen.getByTestId('score-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('reason-list')).toBeInTheDocument();
    expect(screen.getByTestId('green-swaps')).toBeInTheDocument();
  });

  it('displays correct product name', () => {
    renderResultWithState(mockState);
    expect(screen.getByTestId('product-name')).toHaveTextContent('Nutella');
  });

  it('displays correct grade', () => {
    renderResultWithState(mockState);
    expect(screen.getByTestId('grade-letter')).toHaveTextContent('D');
  });

  it('redirects to home when state is missing', async () => {
    renderResultWithState(null);
    await waitFor(() => {
      expect(screen.getByTestId('home-redirect')).toBeInTheDocument();
    });
  });

  it('shows back link', () => {
    renderResultWithState(mockState);
    expect(screen.getByTestId('back-link')).toBeInTheDocument();
  });

  it('shows scan another button', () => {
    renderResultWithState(mockState);
    expect(screen.getByTestId('scan-another')).toBeInTheDocument();
  });
});

// ─── About Page ──────────────────────────────────────────────────────────────
describe('About page', () => {
  it('renders methodology content', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
    expect(screen.getByText('How GreenLens works')).toBeInTheDocument();
  });

  it('shows all 3 steps', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByText('Scan a barcode')).toBeInTheDocument();
    expect(screen.getByText('AI analysis')).toBeInTheDocument();
    expect(screen.getByText('Your eco grade')).toBeInTheDocument();
  });

  it('shows grade scale A-F', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByText(/Excellent/)).toBeInTheDocument();
    expect(screen.getByText(/Harmful/)).toBeInTheDocument();
  });

  it('shows data sources', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByText('Open Food Facts')).toBeInTheDocument();
    expect(screen.getByText('Groq (Llama 3.3 70B)')).toBeInTheDocument();
  });
});
