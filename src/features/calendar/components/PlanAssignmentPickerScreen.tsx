import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { PlanPickerListItem } from '@/features/calendar/components/PlanPickerListItem';
import { useAssignPlanToDay } from '@/features/calendar/hooks/useAssignPlanToDay';
import { useAuth } from '@/features/auth';
import { usePlans } from '@/features/plans';

export type PlanAssignmentPickerScreenProps = {
  date: string;
};

export function PlanAssignmentPickerScreen({ date }: PlanAssignmentPickerScreenProps) {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: plans, isLoading } = usePlans(userId);
  const assignPlanToDay = useAssignPlanToDay(userId);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  function handlePick(planId: string) {
    assignPlanToDay.mutate({ date, planId }, { onSuccess: () => router.back() });
  }

  return (
    <Screen padded={false} style={styles.screen}>
      {!plans || plans.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          Todavía no hay planes. Crea uno en Despensa → Planes.
        </ThemedText>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PlanPickerListItem plan={item} onPress={() => handlePick(item.id)} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
