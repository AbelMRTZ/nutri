import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth';
import { ProfileForm, useUpdateProfile, type ProfileSubmitValues } from '@/features/profile';

export function OnboardingWizard() {
  const { session } = useAuth();
  const updateProfile = useUpdateProfile(session?.user.id);

  function handleSubmit(values: ProfileSubmitValues) {
    updateProfile.mutate({ ...values, onboarding_completed: true });
  }

  return (
    <Screen scroll style={styles.content}>
      <ProfileForm
        mode="onboarding"
        defaultValues={{}}
        onSubmit={handleSubmit}
        submitting={updateProfile.isPending}
        submitLabel="Completar registro"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
});
