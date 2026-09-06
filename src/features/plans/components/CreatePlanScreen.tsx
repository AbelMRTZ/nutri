import { useRouter } from 'expo-router';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { PlanForm } from '@/features/plans/components/PlanForm';
import { useCreatePlan } from '@/features/plans/hooks/useCreatePlan';
import type { PlanFormValues } from '@/features/plans/schema';

export function CreatePlanScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;
  const createPlan = useCreatePlan(userId);

  function handleSubmit(values: PlanFormValues) {
    const isSpecial = values.type === 'special';
    createPlan.mutate(
      {
        name: values.name,
        is_special: isSpecial,
        calories_target: isSpecial ? values.calories_target : null,
        protein_g_target: isSpecial ? values.protein_g_target : null,
        carbs_g_target: isSpecial ? values.carbs_g_target : null,
        fat_g_target: isSpecial ? values.fat_g_target : null,
      },
      {
        // A freshly created plan has no meals yet — the next step is always
        // adding some, so we replace (not push) into its detail screen.
        onSuccess: (plan) => router.replace(`/(app)/(tabs)/despensa/planes/${plan.id}`),
      },
    );
  }

  return (
    <Screen scroll>
      <PlanForm defaultValues={{}} onSubmit={handleSubmit} submitting={createPlan.isPending} submitLabel="Crear plan" />
    </Screen>
  );
}
