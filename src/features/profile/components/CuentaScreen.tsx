import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth, useSignOut } from '@/features/auth';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { toFormDefaults } from '@/features/profile/mappers';
import type { ProfileSubmitValues } from '@/features/profile/components/ProfileForm';

export function CuentaScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile, isLoading } = useProfile(userId);
  const updateProfile = useUpdateProfile(userId);
  const signOut = useSignOut();

  if (isLoading || !profile) {
    return <FullScreenSpinner />;
  }

  function handleSubmit(values: ProfileSubmitValues) {
    updateProfile.mutate(values);
  }

  return (
    <Screen scroll style={styles.content}>
      <ThemedText type="title" style={styles.heading}>
        Cuenta
      </ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        {session?.user.email}
      </ThemedText>

      <ProfileForm
        mode="edit"
        defaultValues={toFormDefaults(profile)}
        onSubmit={handleSubmit}
        submitting={updateProfile.isPending}
        submitLabel="Guardar cambios"
      />

      {updateProfile.isSuccess ? (
        <ThemedText type="small" themeColor="success">
          Cambios guardados
        </ThemedText>
      ) : null}

      <Button variant="ghost" title="Cerrar sesión" onPress={() => signOut.mutate()} loading={signOut.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  heading: {
    fontSize: 28,
    lineHeight: 34,
  },
});
