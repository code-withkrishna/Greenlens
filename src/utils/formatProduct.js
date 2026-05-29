/**
 * Normalize Open Food Facts API response into a clean product object.
 */
export function formatProduct(rawData, barcode) {
  if (!rawData || rawData.status !== 1) {
    throw new Error('Product not found');
  }

  const p = rawData.product ?? {};

  return {
    barcode: barcode ?? p.code ?? '',
    name: p.product_name || p.product_name_en || 'Unknown product',
    brand: p.brands || 'Unknown brand',
    category: p.categories_tags?.[0]?.replace('en:', '') || 'Unknown',
    ingredients: p.ingredients_text || p.ingredients_text_en || '',
    packaging: p.packaging || '',
    packaging_tags: Array.isArray(p.packaging_tags) ? p.packaging_tags : [],
    ecoscore_grade: p.ecoscore_grade || null,
    nova_group: p.nova_group || null,
    countries: p.countries || '',
    image_url: p.image_url || null,
    nutriments: {
      energy_kcal: p.nutriments?.['energy-kcal_100g'] ?? null,
      saturated_fat: p.nutriments?.['saturated-fat_100g'] ?? null,
      sugars: p.nutriments?.sugars_100g ?? null,
    },
  };
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}
