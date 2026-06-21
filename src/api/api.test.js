import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('fetchProduct (openFoodFacts)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws on empty barcode', async () => {
    const { fetchProduct } = await import('./openFoodFacts');
    await expect(fetchProduct('')).rejects.toThrow('Barcode is required');
    await expect(fetchProduct('   ')).rejects.toThrow('Barcode is required');
  });

  it('throws when product not found (status 0)', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 0 } });
    const { fetchProduct } = await import('./openFoodFacts');
    await expect(fetchProduct('0000000000000')).rejects.toThrow('Product not found');
  });

  it('returns formatted product on success', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        status: 1,
        product: {
          product_name: 'Nutella',
          brands: 'Ferrero',
          categories_tags: ['en:spreads'],
          packaging: 'Glass jar',
          packaging_tags: ['en:glass'],
          ecoscore_grade: 'd',
          nova_group: 4,
          countries: 'France',
        },
      },
    });
    const { fetchProduct } = await import('./openFoodFacts');
    const result = await fetchProduct('3017620422003');
    expect(result.name).toBe('Nutella');
    expect(result.brand).toBe('Ferrero');
    expect(result.barcode).toBe('3017620422003');
    expect(result.category).toBe('spreads');
  });

  it('trims whitespace from barcode', async () => {
    axios.get.mockResolvedValueOnce({
      data: { status: 1, product: { product_name: 'Test' } },
    });
    const { fetchProduct } = await import('./openFoodFacts');
    await fetchProduct('  123456  ');
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/123456.json')
    );
  });
});

describe('scoreProduct (groqScore)', () => {
  const mockProductData = {
    name: 'Nutella',
    brand: 'Ferrero',
    category: 'spreads',
    ingredients: 'Sugar, palm oil, hazelnuts',
    packaging: 'Glass jar',
    packaging_tags: ['en:glass'],
    ecoscore_grade: 'd',
    nova_group: 4,
    countries: 'France',
  };

  const mockScorePayload = {
    grade: 'D',
    overall_score: 35,
    co2_score: 28,
    water_score: 40,
    packaging_score: 38,
    grade_label: 'Poor',
    reasons: ['Palm oil drives deforestation.', 'Ultra-processed (NOVA 4).', 'High sugar content.'],
    greener_swaps: [
      { name: 'Organic almond butter', why: 'No palm oil.', estimated_grade: 'B' },
      { name: 'Whole grain peanut butter', why: 'Single ingredient.', estimated_grade: 'A' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('calls the serverless score endpoint with product data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScorePayload,
    });

    const { scoreProduct } = await import('./groqScore');
    await scoreProduct(mockProductData);

    expect(fetch).toHaveBeenCalledWith('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productData: mockProductData }),
    });
  });

  it('parses JSON response correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockScorePayload,
    });

    const { scoreProduct } = await import('./groqScore');
    const result = await scoreProduct(mockProductData);

    expect(result.grade).toBe('D');
    expect(result.overall_score).toBe(35);
    expect(result.reasons).toHaveLength(3);
    expect(result.greener_swaps).toHaveLength(2);
  });

  it('throws when the API returns an error payload', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({ error: 'Invalid AI response' }),
    });

    const { scoreProduct } = await import('./groqScore');
    await expect(scoreProduct(mockProductData)).rejects.toThrow('Invalid AI response');
  });

  it('throws on invalid response missing required fields', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ grade: 'D' }),
    });

    const { scoreProduct } = await import('./groqScore');
    await expect(scoreProduct(mockProductData)).rejects.toThrow('missing field');
  });
});
