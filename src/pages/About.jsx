import { GRADE_CONFIG } from '../utils/gradeConfig';

export default function About() {
  return (
    <div className="space-y-6 py-6" data-testid="about-page">
      <div>
        <h1 className="text-xl font-bold text-green-900">How GreenLens works</h1>
        <p className="mt-1 text-sm text-gray-500">
          Built for Next Byte Hacks V2 · 2026
        </p>
      </div>

      {/* 3 steps */}
      <div className="space-y-3">
        {[
          { step: '1', title: 'Scan a barcode', desc: 'Type or scan any product barcode. GreenLens looks it up in the Open Food Facts database — over 3 million products worldwide.' },
          { step: '2', title: 'Two-stage AI analysis', desc: 'Product data is sent through a two-stage Groq (Llama 3.3) pipeline. A scorer agent generates the initial grade; a validator agent audits it for logical consistency before results reach you.' },
          { step: '3', title: 'Your eco grade', desc: 'You get an A–F grade, three sub-scores for CO₂, water usage, and packaging, plus specific reasons and greener alternatives.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
              {step}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Score explanations */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-800">What each score means</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span>☁️</span>
            <div><strong>CO₂ Footprint</strong> — Considers food miles, processing level (NOVA group), and whether the product is animal or plant-based.</div>
          </div>
          <div className="flex items-start gap-2">
            <span>💧</span>
            <div><strong>Water Usage</strong> — Accounts for water-intensive crops (almonds, beef) and production water use.</div>
          </div>
          <div className="flex items-start gap-2">
            <span>♻️</span>
            <div><strong>Packaging</strong> — Glass and cardboard score high; single-use plastic scores low.</div>
          </div>
        </div>
      </div>

      {/* Grade scale */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-gray-800">Grade scale</h2>
        <div className="space-y-1.5 text-xs">
          {Object.entries(GRADE_CONFIG).map(([grade, config]) => (
            <div
              key={grade}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ backgroundColor: config.bg }}
            >
              <span className="font-bold w-4" style={{ color: config.color }}>{grade}</span>
              <span style={{ color: config.color }}>
                {config.label} ({config.range[0]}–{config.range[1]})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Limitations</p>
        <p className="text-xs">GreenLens scores are AI estimates based on available product data, not certified environmental assessments. Data quality varies by product. Use scores as a guide, not a definitive rating.</p>
      </div>

      {/* Data sources */}
      <div className="rounded-2xl bg-white p-5 shadow-sm text-sm text-gray-600">
        <h2 className="mb-2 text-base font-semibold text-gray-800">Data sources</h2>
        <ul className="space-y-1 text-xs">
          <li>🥫 <a href="https://world.openfoodfacts.org" className="text-green-700 underline" target="_blank" rel="noreferrer">Open Food Facts</a> — open product database, 3M+ entries</li>
          <li>🤖 <a href="https://groq.com" className="text-green-700 underline" target="_blank" rel="noreferrer">Groq (Llama 3.3 70B)</a> — two-stage AI scoring pipeline</li>
          <li>🌿 <a href="https://vercel.com" className="text-green-700 underline" target="_blank" rel="noreferrer">Vercel</a> — serverless deployment, API key proxying</li>
        </ul>
      </div>

      <p className="text-center text-xs text-gray-400">
        Built with 💚 for Next Byte Hacks V2 · 2026
      </p>
    </div>
  );
}
