import axios from 'axios';
import { formatProduct } from '../utils/formatProduct';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

export async function fetchProduct(barcode) {
  if (!barcode || barcode.trim() === '') {
    throw new Error('Barcode is required');
  }

  const { data } = await axios.get(`${BASE_URL}/${barcode.trim()}.json`);

  if (data.status !== 1) {
    throw new Error('Product not found');
  }

  return formatProduct(data, barcode.trim());
}
