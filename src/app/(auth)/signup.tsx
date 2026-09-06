import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SignupForm } from '@/features/auth';

export default function SignupScreen() {
  return (
    <Screen scroll style={styles.content}>
      <ThemedText type="title" style={styles.title}>
        Crea tu cuenta
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        Después de registrarte, personalizaremos la app con tus datos.
      </ThemedText>
      <SignupForm />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
  },
});
