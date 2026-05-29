import { describe, it, expect } from 'vitest';
import { GRADE_CONFIG, getGradeConfig, getBarColor, scoreToGrade } from './gradeConfig';

describe('GRADE_CONFIG', () => {
  it('has all 6 grades defined', () => {
    expect(Object.keys(GRADE_CONFIG)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('each grade has required fields', () => {
    for (const grade of Object.values(GRADE_CONFIG)) {
      expect(grade).toHaveProperty('color');
      expect(grade).toHaveProperty('bg');
      expect(grade).toHaveProperty('barColor');
      expect(grade).toHaveProperty('label');
      expect(grade).toHaveProperty('description');
      expect(grade).toHaveProperty('range');
    }
  });
});

describe('getGradeConfig', () => {
  it('returns config for valid grade', () => {
    expect(getGradeConfig('A').label).toBe('Excellent');
    expect(getGradeConfig('F').label).toBe('Harmful');
  });

  it('falls back to F for unknown grade', () => {
    expect(getGradeConfig('Z').label).toBe('Harmful');
    expect(getGradeConfig(undefined).label).toBe('Harmful');
  });
});

describe('getBarColor', () => {
  it('returns green for scores >= 70', () => {
    expect(getBarColor(70)).toBe('#3B6D11');
    expect(getBarColor(100)).toBe('#3B6D11');
  });

  it('returns amber for scores 40-69', () => {
    expect(getBarColor(40)).toBe('#EF9F27');
    expect(getBarColor(69)).toBe('#EF9F27');
  });

  it('returns red for scores < 40', () => {
    expect(getBarColor(0)).toBe('#E24B4A');
    expect(getBarColor(39)).toBe('#E24B4A');
  });
});

describe('scoreToGrade', () => {
  it('maps scores to correct grades', () => {
    expect(scoreToGrade(100)).toBe('A');
    expect(scoreToGrade(85)).toBe('A');
    expect(scoreToGrade(75)).toBe('B');
    expect(scoreToGrade(55)).toBe('C');
    expect(scoreToGrade(35)).toBe('D');
    expect(scoreToGrade(20)).toBe('E');
    expect(scoreToGrade(5)).toBe('F');
    expect(scoreToGrade(0)).toBe('F');
  });
});
