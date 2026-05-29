import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

// Properly stub import.meta.env for Vitest
vi.stubEnv('VITE_GROQ_API_KEY', 'test-groq-key');

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
      { name: 'Pip & Nut Almond Butter', why: 'No palm oil.', estimated_grade: 'B' },
      { name: 'Whole Earth Peanut Butter', why: 'Single ingredient.', estimated_grade: 'A' },
    ],
  };

  // Groq returns OpenAI-compatible format: choices[0].message.content
  const groqResponse = (content) => ({
    data: { choices: [{ message: { content } }] },
  });

  beforeEach(() => vi.clearAllMocks());

  it('calls Groq endpoint with correct headers', async () => {
    axios.post.mockResolvedValueOnce(groqResponse(JSON.stringify(mockScorePayload)));
    const { scoreProduct } = await import('./groqScore');
    await scoreProduct(mockProductData);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({ model: 'llama-3.3-70b-versatile' }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-groq-key',
        }),
      })
    );
  });

  it('sends system prompt as a message role', async () => {
    axios.post.mockResolvedValueOnce(groqResponse(JSON.stringify(mockScorePayload)));
    const { scoreProduct } = await import('./groqScore');
    await scoreProduct(mockProductData);
    const body = axios.post.mock.calls[0][1];
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1].role).toBe('user');
  });

  it('parses JSON response correctly', async () => {
    axios.post.mockResolvedValueOnce(groqResponse(JSON.stringify(mockScorePayload)));
    const { scoreProduct } = await import('./groqScore');
    const result = await scoreProduct(mockProductData);
    expect(result.grade).toBe('D');
    expect(result.overall_score).toBe(35);
    expect(result.reasons).toHaveLength(3);
    expect(result.greener_swaps).toHaveLength(2);
  });

  it('strips markdown fences from response', async () => {
    const wrapped = '```json\n' + JSON.stringify(mockScorePayload) + '\n```';
    axios.post.mockResolvedValueOnce(groqResponse(wrapped));
    const { scoreProduct } = await import('./groqScore');
    const result = await scoreProduct(mockProductData);
    expect(result.grade).toBe('D');
  });

  it('throws on invalid response missing required fields', async () => {
    axios.post.mockResolvedValueOnce(groqResponse('{"grade":"D"}'));
    const { scoreProduct } = await import('./groqScore');
    await expect(scoreProduct(mockProductData)).rejects.toThrow('missing field');
  });
});
