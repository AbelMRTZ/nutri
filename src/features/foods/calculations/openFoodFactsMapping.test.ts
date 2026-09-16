import type { OpenFoodFactsProduct } from '@/features/foods/api/openFoodFacts';

import { mapOpenFoodFactsProduct } from './openFoodFactsMapping';

describe('mapOpenFoodFactsProduct', () => {
  it('maps a full realistic product with correct unit conversion and rounding', () => {
    const product: OpenFoodFactsProduct = {
      product_name: 'Corn Flakes',
      product_name_es: 'Copos de maíz',
      nutrition_data_per: '100g',
      nutriments: {
        'energy-kcal_100g': 357,
        proteins_100g: 7,
        carbohydrates_100g: 84,
        fat_100g: 0.9,
        'saturated-fat_100g': 0.2,
        fiber_100g: 3,
        sugars_100g: 8,
        salt_100g: 1.13,
        iron_100g: 0.008,
        'vitamin-b2_100g': 0.00133333333333333,
        'vitamin-d_100g': 0.0000084,
      },
    };

    const result = mapOpenFoodFactsProduct(product);

    expect(result.name).toBe('Copos de maíz');
    expect(result.serving_type).toBe('per_100g');
    expect(result.energy_kcal).toBe(357);
    expect(result.protein_g).toBe(7);
    expect(result.carbs_g).toBe(84);
    expect(result.fat_g).toBe(0.9);
    expect(result.saturated_fat_g).toBe(0.2);
    expect(result.fiber_g).toBe(3);
    expect(result.sugar_g).toBe(8);
    expect(result.salt_g).toBe(1.13);
    expect(result.iron_mg).toBe(8);
    expect(result.vitamin_b2_mg).toBe(1.33);
    expect(result.vitamin_d_mcg).toBe(8.4);
  });

  it('maps vitamin-pp to vitamin_b3_mg (niacin naming trap)', () => {
    const result = mapOpenFoodFactsProduct({
      nutrition_data_per: '100g',
      nutriments: { 'vitamin-pp_100g': 0.013 },
    });

    expect(result.vitamin_b3_mg).toBe(13);
  });

  it('maps pantothenic-acid to vitamin_b5_mg (B5 naming trap)', () => {
    const result = mapOpenFoodFactsProduct({
      nutrition_data_per: '100g',
      nutriments: { 'pantothenic-acid_100g': 0.002 },
    });

    expect(result.vitamin_b5_mg).toBe(2);
  });

  it('maps biotin to vitamin_b7_mcg and never populates vitamin_b8_mcg', () => {
    const result = mapOpenFoodFactsProduct({
      nutrition_data_per: '100g',
      nutriments: { biotin_100g: 0.00005 },
    });

    expect(result.vitamin_b7_mcg).toBe(50);
    expect(result.vitamin_b8_mcg).toBeUndefined();
  });

  it('skips all nutrient prefill when nutrition_data_per is not 100g', () => {
    const result = mapOpenFoodFactsProduct({
      product_name: 'Serving-based product',
      nutrition_data_per: 'serving',
      nutriments: { proteins_100g: 10, 'energy-kcal_100g': 200 },
    });

    expect(result).toEqual({ name: 'Serving-based product' });
  });

  it('falls back energy_kcal from kJ when kcal is missing', () => {
    const result = mapOpenFoodFactsProduct({
      nutrition_data_per: '100g',
      nutriments: { 'energy-kj_100g': 2252 },
    });

    expect(result.energy_kcal).toBe(round(2252 / 4.184));
  });

  it('falls back to product_name when product_name_es is missing', () => {
    const result = mapOpenFoodFactsProduct({ product_name: 'Nutella' });
    expect(result.name).toBe('Nutella');
  });

  it('leaves name absent when neither name field is present', () => {
    const result = mapOpenFoodFactsProduct({ nutrition_data_per: '100g' });
    expect(result.name).toBeUndefined();
  });

  it('does not throw when nutriments is missing entirely', () => {
    expect(() => mapOpenFoodFactsProduct({ nutrition_data_per: '100g' })).not.toThrow();
    expect(mapOpenFoodFactsProduct({ nutrition_data_per: '100g' })).toEqual({ serving_type: 'per_100g' });
  });
});

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
