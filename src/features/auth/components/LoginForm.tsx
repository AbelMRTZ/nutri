import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { TextField } from '@/components/text-field';
import { friendlyAuthErrorMessage } from '@/features/auth/errors';
import { useSignIn } from '@/features/auth/hooks/useSignIn';
import { credentialsSchema, type CredentialsFormValues } from '@/features/auth/schema';

export function LoginForm() {
  const signIn = useSignIn();
  const { control, handleSubmit } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });
  // See BasicInfoStep.tsx for why this must be `useFormState`, not
  // `formState` destructured off `useForm()`.
  const { errors } = useFormState({ control });

  const onSubmit = (values: CredentialsFormValues) => {
    signIn.mutate(values);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email?.message}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            label="Contraseña"
            secureTextEntry
            autoComplete="password"
            error={errors.password?.message}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {signIn.isError ? (
        <ThemedText type="small" themeColor="danger">
          {friendlyAuthErrorMessage(signIn.error)}
        </ThemedText>
      ) : null}

      <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={signIn.isPending} />

      <Link href="/(auth)/signup" style={styles.link}>
        <ThemedText type="link" themeColor="textSecondary">
          ¿No tienes cuenta? Regístrate
        </ThemedText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  link: {
    alignSelf: 'center',
    marginTop: 8,
  },
});
