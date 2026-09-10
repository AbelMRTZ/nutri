import { useLocalSearchParams } from 'expo-router';

import { ReferenceFoodDetailScreen } from '@/features/food-catalog';

export default function AlimentoUsdaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReferenceFoodDetailScreen id={id} />;
}
