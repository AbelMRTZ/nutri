import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { AuthHeaderAccent, LoginForm } from '@/features/auth';
import { Logo } from '@/features/app-shell';

export default function LoginScreen() {
  return (
    <Screen scroll style={styles.content}>
      <AuthHeaderAccent />
      <View style={styles.logoRow}>
        <Logo />
      </View>
      <ThemedText type="title" style={styles.title}>
        Bienvenido{'\n'}de vuelta
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
  logoRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
  },
});
