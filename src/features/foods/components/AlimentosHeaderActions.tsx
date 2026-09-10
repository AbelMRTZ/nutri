import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type AddFoodOption = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
};

/** Header-right "add" and "help" actions for the Alimentos list screen. */
export function AlimentosHeaderActions() {
  const theme = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const options: AddFoodOption[] = [
    {
      icon: 'create-outline',
      label: 'Alimento Propio',
      onPress: () => router.push('/(app)/(tabs)/despensa/alimentos/nuevo'),
    },
    {
      icon: 'globe-outline',
      label: 'Alimento USDA',
      onPress: () => router.push('/(app)/(tabs)/despensa/alimentos/usda'),
    },
    {
      icon: 'qr-code-outline',
      label: 'Alimento por QR',
      onPress: () => Alert.alert('Próximamente', 'Añadir un alimento escaneando un código QR estará disponible pronto.'),
    },
  ];

  function handleSelect(option: AddFoodOption) {
    setMenuVisible(false);
    option.onPress();
  }

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
        accessibilityLabel="Añadir alimento"
        hitSlop={10}
        onPress={() => setMenuVisible(true)}>
        <Ionicons name="add" size={26} color={theme.text} />
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <Pressable
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(event) => event.stopPropagation()}>
            <ThemedText type="subtitle" style={styles.title}>
              Añadir alimento
            </ThemedText>
            {options.map((option) => (
              <Pressable
                key={option.label}
                style={[styles.optionRow, { borderColor: theme.divider }]}
                onPress={() => handleSelect(option)}>
                <Ionicons name={option.icon} size={20} color={theme.text} />
                <ThemedText type="default" style={styles.optionLabel}>
                  {option.label}
                </ThemedText>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    gap: 4,
  },
  title: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderTopWidth: 1,
  },
  optionLabel: {
    flex: 1,
  },
});
