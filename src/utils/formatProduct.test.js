import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatProduct, formatTimeAgo } from './formatProduct';

const mockRawProduct = {
  status: 1,
  product: {
    product_name: 'Nutella',
    brands: 'Ferrero',
    categories_tags: ['en:spreads', 'en:hazelnut-spreads'],
    ingredients_text: 'Sugar, palm oil, hazelnuts',
    packaging: 'Glass jar',
    packaging_tags: ['en:glass', 'en:jar'],
    ecoscore_grade: 'd',
    nova_group: 4,
    countries: 'France',
    image_url: 'https://example.com/nutella.jpg',
    nutriments: {
      'energy-kcal_100g': 539,
      'saturated-fat_100g': 10.6,
      sugars_100g: 56.3,
    },
  },
};

describe('formatProduct', () => {
  it('throws on status !== 1', () => {
    expect(() => formatProduct({ status: 0 }, '123')).toThrow('Product not found');
    expect(() => formatProduct(null, '123')).toThrow('Product not found');
  });

  it('extracts name, brand, category correctly', () => {
    const result = formatProduct(mockRawProduct, '3017620422003');
    expect(result.name).toBe('Nutella');
    expect(result.brand).toBe('Ferrero');
    expect(result.category).toBe('spreads');
  });

  it('strips "en:" prefix from category', () => {
    const result = formatProduct(mockRawProduct, '3017620422003');
    expect(result.category).not.toContain('en:');
  });

  it('includes barcode', () => {
    const result = formatProduct(mockRawProduct, '3017620422003');
    expect(result.barcode).toBe('3017620422003');
  });

  it('falls back gracefully for missing fields', () => {
    const minimal = { status: 1, product: {} };
    const result = formatProduct(minimal, '123');
    expect(result.name).toBe('Unknown product');
    expect(result.brand).toBe('Unknown brand');
    expect(result.category).toBe('Unknown');
    expect(result.packaging_tags).toEqual([]);
    expect(result.ingredients).toBe('');
  });

  it('includes nutriments', () => {
    const result = formatProduct(mockRawProduct, '123');
    expect(result.nutriments.energy_kcal).toBe(539);
    expect(result.nutriments.saturated_fat).toBe(10.6);
  });
});

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-16T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for recent timestamps', () => {
    expect(formatTimeAgo('2026-05-16T11:59:50Z')).toBe('just now');
  });

  it('returns minutes for < 1 hour', () => {
    expect(formatTimeAgo('2026-05-16T11:30:00Z')).toBe('30m ago');
  });

  it('returns hours for < 1 day', () => {
    expect(formatTimeAgo('2026-05-16T08:00:00Z')).toBe('4h ago');
  });

  it('returns "yesterday" for ~24h ago', () => {
    expect(formatTimeAgo('2026-05-15T11:00:00Z')).toBe('yesterday');
  });

  it('returns days for older timestamps', () => {
    expect(formatTimeAgo('2026-05-13T12:00:00Z')).toBe('3 days ago');
  });
});
