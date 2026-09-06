import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** Header-right "add" and "help" actions for the Planes list screen. */
export function PlanesHeaderActions() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ayuda"
        hitSlop={10}
        onPress={() => Alert.alert('Próximamente', 'El manual de usuario estará disponible pronto.')}>
        <Ionicons name="help-circle-outline" size={22} color={theme.text} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Añadir plan"
        hitSlop={10}
        onPress={() => router.push('/(app)/(tabs)/despensa/planes/nuevo')}>
        <Ionicons name="add" size={26} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 16,
  },
});
