import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Styled confirmation modal, used in place of a bare native Alert. */
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  destructive = true,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={(event) => event.stopPropagation()}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {description ? (
            <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
              {description}
            </ThemedText>
          ) : null}
          <View style={styles.buttonsRow}>
            <Button variant="secondary" title={cancelLabel} style={styles.flexButton} onPress={onCancel} />
            <Button
              variant="primary"
              title={confirmLabel}
              style={[styles.flexButton, destructive && { backgroundColor: theme.danger }]}
              loading={loading}
              onPress={onConfirm}
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
    gap: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  description: {
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  flexButton: {
    flex: 1,
  },
});
