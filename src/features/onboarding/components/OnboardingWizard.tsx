import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
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
    <Screen padded={false}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <ProfileForm
          mode="onboarding"
          defaultValues={{}}
          onSubmit={handleSubmit}
          submitting={updateProfile.isPending}
          submitLabel="Completar registro"
        />
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={() => signOut.mutate()}
        disabled={signOut.isPending}
        style={({ pressed }) => [styles.cancelButton, { opacity: pressed || signOut.isPending ? 0.6 : 1 }]}>
        <ThemedText type="link" themeColor="textSecondary">
          {signOut.isPending ? 'Cerrando sesión…' : 'Cancelar y volver a iniciar sesión'}
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});
