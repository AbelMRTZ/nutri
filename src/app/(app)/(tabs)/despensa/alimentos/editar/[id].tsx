import { useLocalSearchParams } from 'expo-router';

import { EditFoodScreen } from '@/features/foods';

export default function EditarAlimento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditFoodScreen id={id} />;
}
