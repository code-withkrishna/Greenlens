import { describe, it, expect } from 'vitest';
import {
  getScoreSchemaErrors,
  assertValidScoreResponse,
  SCORE_REQUIRED_FIELDS,
} from './scoreSchema.js';

const validScore = {
  grade: 'B',
  overall_score: 75,
  co2_score: 80,
  water_score: 70,
  packaging_score: 72,
  reasons: ['Reason 1', 'Reason 2', 'Reason 3'],
  greener_swaps: [{ name: 'Swap', why: 'Better', estimated_grade: 'A' }],
};

describe('scoreSchema', () => {
  it('exports all required fields', () => {
    expect(SCORE_REQUIRED_FIELDS).toHaveLength(7);
    expect(SCORE_REQUIRED_FIELDS).toContain('grade');
  });

  it('returns no errors for a valid score', () => {
    expect(getScoreSchemaErrors(validScore)).toEqual([]);
  });

  it('flags missing fields and invalid grade', () => {
    const errors = getScoreSchemaErrors({ grade: 'Z', overall_score: 75 });
    expect(errors.some((e) => e.includes('missing field'))).toBe(true);
    expect(errors).toContain('invalid grade "Z"');
  });

  it('flags out-of-range overall_score', () => {
    expect(getScoreSchemaErrors({ ...validScore, overall_score: 150 })).toContain(
      'overall_score must be 0-100'
    );
  });

  it('assertValidScoreResponse returns data when valid', () => {
    expect(assertValidScoreResponse(validScore)).toEqual(validScore);
  });

  it('assertValidScoreResponse throws when a field is missing', () => {
    expect(() => assertValidScoreResponse({ grade: 'A' })).toThrow('missing field');
  });
});
