import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScanHistory } from './useScanHistory';

const mockScanResult = {
  product: {
    barcode: '3017620422003',
    name: 'Nutella',
    brand: 'Ferrero',
  },
  score: {
    grade: 'D',
    overall_score: 35,
    co2_score: 28,
    water_score: 40,
    packaging_score: 38,
    grade_label: 'Poor',
    reasons: ['Palm oil.', 'Ultra-processed.', 'High emissions.'],
    greener_swaps: [],
  },
};

describe('useScanHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with empty history when localStorage is empty', () => {
    const { result } = renderHook(() => useScanHistory());
    expect(result.current.history).toEqual([]);
  });

  it('adds a scan to history', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(mockScanResult));
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].product.name).toBe('Nutella');
  });

  it('adds scannedAt timestamp to each entry', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(mockScanResult));
    expect(result.current.history[0].scannedAt).toBeDefined();
    expect(new Date(result.current.history[0].scannedAt)).toBeInstanceOf(Date);
  });

  it('newest scan appears first', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan({ ...mockScanResult, product: { ...mockScanResult.product, name: 'First' } }));
    act(() => result.current.addScan({ ...mockScanResult, product: { ...mockScanResult.product, name: 'Second' } }));
    expect(result.current.history[0].product.name).toBe('Second');
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(mockScanResult));
    const stored = JSON.parse(localStorage.getItem('greenlens_history'));
    expect(stored).toHaveLength(1);
  });

  it('caps history at 10 entries', () => {
    const { result } = renderHook(() => useScanHistory());
    for (let i = 0; i < 12; i++) {
      act(() => result.current.addScan({
        ...mockScanResult,
        product: { ...mockScanResult.product, name: `Product ${i}`, barcode: `${i}` },
      }));
    }
    expect(result.current.history).toHaveLength(10);
  });

  it('clears history and localStorage', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(mockScanResult));
    act(() => result.current.clearHistory());
    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('greenlens_history')).toBeNull();
  });

  it('loads history from localStorage on mount', () => {
    const existingHistory = [{ ...mockScanResult, scannedAt: new Date().toISOString(), id: 'test-1' }];
    localStorage.setItem('greenlens_history', JSON.stringify(existingHistory));
    const { result } = renderHook(() => useScanHistory());
    expect(result.current.history).toHaveLength(1);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('greenlens_history', 'invalid-json{{{');
    const { result } = renderHook(() => useScanHistory());
    expect(result.current.history).toEqual([]);
  });
});
