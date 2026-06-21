import { assertValidScoreResponse } from '../../shared/scoreSchema.js';

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function readErrorDetail(response) {
  try {
    const errJson = await response.json();
    return errJson.error || '';
  } catch {
    return response.text();
  }
}

export async function scoreProduct(productData) {
  const response = await fetch('/api/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productData }),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(detail || `Scoring request failed (${response.status})`);
  }

  const parsed = await response.json();
  return assertValidScoreResponse(parsed);
}
