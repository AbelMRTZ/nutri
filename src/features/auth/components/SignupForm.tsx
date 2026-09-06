import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { TextField } from '@/components/text-field';
import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { credentialsSchema, type CredentialsFormValues } from '@/features/auth/schema';

export function SignupForm() {
  const signUp = useSignUp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: CredentialsFormValues) => {
    signUp.mutate(values);
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
          {signUp.error instanceof Error ? signUp.error.message : 'No se pudo completar el registro'}
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
