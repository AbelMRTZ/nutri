import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { TextField } from '@/components/text-field';
import { friendlyAuthErrorMessage } from '@/features/auth/errors';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { credentialsSchema, type CredentialsFormValues } from '@/features/auth/schema';

export function SignupForm() {
  const router = useRouter();
  const signUp = useSignUp();
  const [confirmationSent, setConfirmationSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: CredentialsFormValues) => {
    signUp.mutate(values, {
      // A successful signUp only carries a session when email confirmation
      // is off; otherwise the account exists but is unusable until the user
      // clicks the confirmation link, so there's nothing to redirect to —
      // just tell them what happened instead of leaving the screen looking
      // like nothing occurred.
      onSuccess: (data) => {
        if (!data.session) {
          setConfirmationSent(true);
        }
      },
    });
  };

  if (confirmationSent) {
    return (
      <View style={styles.container}>
        <ThemedText type="subtitle">Revisa tu correo</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Te hemos enviado un enlace de confirmación. Ábrelo para activar tu cuenta y después inicia sesión.
        </ThemedText>
        <Button title="Ir a iniciar sesión" variant="secondary" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

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
            autoComplete="password-new"
            error={errors.password?.message}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {signUp.isError ? (
        <ThemedText type="small" themeColor="danger">
          {friendlyAuthErrorMessage(signUp.error)}
        </ThemedText>
      ) : null}

      <Button title="Crear cuenta" onPress={handleSubmit(onSubmit)} loading={signUp.isPending} />

      <Link href="/(auth)/login" style={styles.link}>
        <ThemedText type="link" themeColor="textSecondary">
          ¿Ya tienes cuenta? Inicia sesión
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
