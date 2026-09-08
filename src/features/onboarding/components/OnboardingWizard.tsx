import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { useAuth, useSignOut } from '@/features/auth';
import { ProfileForm, useUpdateProfile, type ProfileSubmitValues } from '@/features/profile';

export function OnboardingWizard() {
  const { session } = useAuth();
  const updateProfile = useUpdateProfile(session?.user.id);
  const signOut = useSignOut();

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

      <Button
        variant="ghost"
        title="Cancelar y volver a iniciar sesión"
        onPress={() => signOut.mutate()}
        loading={signOut.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
});
