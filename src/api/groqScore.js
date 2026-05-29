export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function scoreProduct(productData) {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productData }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errJson = await response.json();
      detail = errJson.error || '';
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `Scoring request failed (${response.status})`);
  }

  const parsed = await response.json();

  const required = [
    'grade',
    'overall_score',
    'co2_score',
    'water_score',
    'packaging_score',
    'reasons',
    'greener_swaps',
  ];

  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Invalid response: missing field "${field}"`);
    }
  }

  return parsed;
}