import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { activityTypeLabels, effortLevelLabel, type EffortLevel } from '@/features/training/schema';
import { useTheme } from '@/hooks/use-theme';
import type { Tables } from '@/lib/supabase/database.types';

const ACTIVITY_ICON: Record<Tables<'calendar_activities'>['activity_type'], keyof typeof Ionicons.glyphMap> = {
  strength: 'barbell-outline',
  running: 'walk-outline',
  hiking: 'trail-sign-outline',
};

function detailLabel(activity: Tables<'calendar_activities'>): string {
  if (activity.calculation_mode === 'manual') return 'Manual';
  const parts: string[] = [];
  if (activity.activity_type !== 'running' && activity.effort_level) {
    parts.push(effortLevelLabel(activity.activity_type, activity.effort_level as EffortLevel));
  }
  if (activity.activity_type === 'running' && activity.distance_km) {
    parts.push(`${activity.distance_km} km`);
  }
  if (activity.duration_minutes) {
    parts.push(`${activity.duration_minutes} min`);
  }
  return parts.join(' · ');
}

export type ActivityRowProps = {
  activity: Tables<'calendar_activities'>;
  onPress?: () => void;
  onDelete?: () => void;
};

/** One activity: icon, name/type, its detail line, and its kcal — with optional tap/delete actions. */
export function ActivityRow({ activity, onPress, onDelete }: ActivityRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      style={[styles.row, { borderColor: theme.border }]}
      onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: theme.primary }]}>
        <Ionicons name={ACTIVITY_ICON[activity.activity_type]} size={18} color={theme.accentSecondary} />
      </View>
      <View style={styles.info}>
        <ThemedText type="smallBold">{activity.name || activityTypeLabels[activity.activity_type]}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {detailLabel(activity)}
        </ThemedText>
      </View>
      <ThemedText type="small" style={{ color: theme.accent }}>
        {activity.calories_burned} kcal
      </ThemedText>
      {onDelete ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Eliminar actividad" hitSlop={10} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
