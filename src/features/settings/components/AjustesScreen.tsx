import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorBanner } from '@/components/error-banner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth';
import { CalendarExportSection } from '@/features/settings/components/CalendarExportSection';

export function AjustesScreen() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [exportError, setExportError] = useState<string | undefined>();

  return (
    <View style={styles.root}>
      <Screen scroll>
        <CalendarExportSection userId={userId} onError={setExportError} />

        <ThemedText type="small" themeColor="textSecondary">
          Más preferencias de la app (unidades, notificaciones, apariencia...) llegarán en una próxima actualización.
        </ThemedText>
      </Screen>

      {exportError ? <ErrorBanner message={exportError} onDismiss={() => setExportError(undefined)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
