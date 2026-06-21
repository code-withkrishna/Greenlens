const SYSTEM_PROMPT = `You are a sustainability scoring expert. When given product data, you analyze its environmental impact and return ONLY a valid JSON object — no markdown, no explanation, no extra text. Just raw JSON.

The JSON must follow this exact schema:
{
  "grade": "A" | "B" | "C" | "D" | "E" | "F",
  "overall_score": <integer 0-100>,
  "co2_score": <integer 0-100, where 100 = lowest CO2>,
  "water_score": <integer 0-100, where 100 = lowest water use>,
  "packaging_score": <integer 0-100, where 100 = best packaging>,
  "grade_label": <short phrase like "Excellent" | "Good" | "Average" | "Poor" | "Very Poor" | "Harmful">,
  "reasons": [
    "<reason 1 — specific, data-driven, 1 sentence>",
    "<reason 2 — specific, data-driven, 1 sentence>",
    "<reason 3 — specific, data-driven, 1 sentence>"
  ],
  "greener_swaps": [
    {
      "name": "<product category description, e.g. 'Organic oat milk in cardboard carton' or 'Loose-leaf tea, no individual bags' — NOT a specific brand or product name>",
      "why": "<1 sentence explaining why this category is more sustainable than the scanned product>",
      "estimated_grade": "A" | "B" | "C"
    },
    {
      "name": "<product category description>",
      "why": "<1 sentence>",
      "estimated_grade": "A" | "B" | "C"
    }
  ]
}

IMPORTANT — greener_swaps rules:
- Describe a product TYPE or CATEGORY to look for — never invent a specific brand or product name
- Good: "Organic whole milk in glass bottle", "Plant-based burger patty, minimal packaging"
- Bad: "Alpro Oat Drink Original", "Innocent Smoothie Berry" — never use real or invented brand names
- Each suggestion must be a different product category from the scanned product
- estimated_grade must be strictly better than the scanned product's grade

Scoring guidelines:
- Grade A (85-100): Organic, minimal packaging, low carbon, local sourcing
- Grade B (70-84): Good environmental practices, minor concerns
- Grade C (50-69): Average — some good, some bad
- Grade D (30-49): Notable environmental concerns
- Grade E (15-29): Poor — high emissions, heavy processing, wasteful packaging
- Grade F (0-14): Very harmful — heavily processed, plastic packaging, palm oil, air-freighted

IMPORTANT — align with certified ecoscore when provided:
- Ecoscore A → overall_score should be 85–100
- Ecoscore B → overall_score should be 70–84
- Ecoscore C → overall_score should be 50–69
- Ecoscore D → overall_score should be 30–49
- Ecoscore E → overall_score should be 15–29

For co2_score, consider: food miles, processing level (nova group), animal products (high CO2), plant-based (low CO2).
For water_score, consider: water-intensive crops (almonds, avocado, beef = low score), packaging production water use.
For packaging_score, consider: glass/paper/cardboard = high, single-use plastic = low, recyclable = medium-high.`;

const VALIDATOR_PROMPT = `You are a quality control reviewer for environmental product scores. Your job is to catch logical inconsistencies and return a corrected score.

Check these rules:
1. NOVA group 4 (ultra-processed) products should have co2_score ≤ 55
2. Products with palm oil in ingredients should have co2_score ≤ 50
3. Beef or lamb products should have water_score ≤ 30
4. Single-use plastic packaging should have packaging_score ≤ 40
5. overall_score should roughly equal (co2_score * 0.4 + water_score * 0.3 + packaging_score * 0.3), rounded to nearest integer
6. grade must match overall_score range: A=85-100, B=70-84, C=50-69, D=30-49, E=15-29, F=0-14

If any rules are violated, return a corrected JSON in the SAME schema. If all looks correct, return the same JSON unchanged. Return ONLY raw JSON — no markdown, no explanation.`;

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

import { getScoreSchemaErrors } from '../shared/scoreSchema.js';

async function callGroq(messages, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1000,
        messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('AI scoring timed out. Please try again.', { cause: err });
    }
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productData } = req.body;

  if (!productData) {
    return res.status(400).json({ error: 'productData is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
  }

  const userMessage = `Score this product for sustainability:

Product name: ${productData.name}
Brand: ${productData.brand}
Category: ${productData.category}
Ingredients: ${productData.ingredients || 'Not listed'}
Packaging: ${productData.packaging || 'Not listed'}
Packaging tags: ${productData.packaging_tags?.join(', ') || 'None'}
Open Food Facts ecoscore: ${productData.ecoscore_grade || 'Not available'}
NOVA processing group: ${productData.nova_group || 'Not available'} (1=unprocessed, 4=ultra-processed)
Countries sold: ${productData.countries || 'Unknown'}

Return ONLY the JSON object. No other text.`;

  try {
    // Stage 1: Scorer agent — generate initial eco score
    const firstPass = await callGroq(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      apiKey
    );

    const stage1Errors = getScoreSchemaErrors(firstPass);
    if (stage1Errors.length > 0) {
      return res.status(502).json({ error: `Invalid AI response: ${stage1Errors.join(', ')}` });
    }

    // Stage 2: Validator agent — check internal consistency and align with certifed data
    const validatorMessage = `Review this eco score for product "${productData.name}":
Nova group: ${productData.nova_group || 'unknown'}
Ingredients: ${productData.ingredients || 'Not listed'}
Packaging tags: ${productData.packaging_tags?.join(', ') || 'None'}

Score to validate:
${JSON.stringify(firstPass, null, 2)}

Check for rule violations and return corrected JSON if needed.`;

    let finalScore;
    try {
      const validated = await callGroq(
        [
          { role: 'system', content: VALIDATOR_PROMPT },
          { role: 'user', content: validatorMessage },
        ],
        apiKey
      );

      const stage2Errors = getScoreSchemaErrors(validated);
      // If validator returns a broken schema, fall back to stage 1 result
      finalScore = stage2Errors.length === 0 ? validated : firstPass;
    } catch {
      // Validator failure is non-fatal — use stage 1 result
      finalScore = firstPass;
    }

    return res.status(200).json(finalScore);

  } catch (err) {
    return res.status(500).json({ error: 'Scoring failed', detail: err.message });
  }
}
