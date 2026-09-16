import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type PromptDialogProps = {
  visible: boolean;
  title: string;
  label?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

/** Styled modal that collects one line of text, in place of a bare native Alert.prompt. */
export function PromptDialog({
  visible,
  title,
  label = 'Nombre',
  initialValue = '',
  confirmLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  loading,
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const theme = useTheme();
  const [value, setValue] = useState(initialValue);
  // The modal stays mounted across visibility toggles (same as ConfirmDialog),
  // so the field must be re-seeded from initialValue every time it re-opens.
  // Adjusted during render (React's recommended alternative to an effect for
  // this) rather than useEffect, to avoid the extra cascading render.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setValue(initialValue);
  }

  const trimmed = value.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={(event) => event.stopPropagation()}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          <TextField label={label} value={value} onChangeText={setValue} autoFocus />
          <View style={styles.buttonsRow}>
            <Button variant="secondary" title={cancelLabel} style={styles.flexButton} onPress={onCancel} />
            <Button
              variant="primary"
              title={confirmLabel}
              style={styles.flexButton}
              loading={loading}
              disabled={trimmed.length === 0}
              onPress={() => onConfirm(trimmed)}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: 22,
    gap: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  flexButton: {
    flex: 1,
  },
});
