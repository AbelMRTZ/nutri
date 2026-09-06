import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { LoginForm } from '@/features/auth';

export default function LoginScreen() {
  return (
    <Screen scroll style={styles.content}>
      <ThemedText type="title" style={styles.title}>
        Nutri
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary">
        Inicia sesión para continuar tu seguimiento nutricional.
      </ThemedText>
      <LoginForm />
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
