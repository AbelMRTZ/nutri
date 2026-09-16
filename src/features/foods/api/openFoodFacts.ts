export type OpenFoodFactsProduct = {
  product_name?: string;
  product_name_es?: string;
  nutrition_data_per?: string;
  nutriments?: Partial<Record<string, number>>;
};

type OpenFoodFactsResponse = {
  status: number; // 1 = found, 0 = not found — NOT an HTTP status
  product?: OpenFoodFactsProduct;
};

export type LookupBarcodeResult =
  | { status: 'found'; product: OpenFoodFactsProduct }
  | { status: 'not_found' }
  | { status: 'error' };

/**
 * Open Food Facts is the first external (non-Supabase) network call in this
 * app — public GET, no API key. A 200 response with status: 0 / no product
 * means "barcode not in OFF's database", a completely normal outcome, not
 * an HTTP error.
 */
export async function lookupBarcode(barcode: string): Promise<LookupBarcodeResult> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`);
    if (!response.ok) return { status: 'error' };

    const data = (await response.json()) as OpenFoodFactsResponse;
    if (data.status !== 1 || !data.product) return { status: 'not_found' };

    return { status: 'found', product: data.product };
  } catch {
    return { status: 'error' };
  }
}
