import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';

import { AppFonts } from '@/constants/theme';
import { TopBar } from '@/features/app-shell';
import { useTheme } from '@/hooks/use-theme';

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  size: number;
  focused: boolean;
  accentColor: string;
};

function TabBarIcon({ name, color, size, focused, accentColor }: TabBarIconProps) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Ionicons name={name} color={color} size={size} />
      <View style={{ width: 4, height: 4, backgroundColor: focused ? accentColor : 'transparent' }} />
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();

  const renderIcon = (name: keyof typeof Ionicons.glyphMap) =>
    function renderTabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
      return <TabBarIcon name={name} color={color} size={size} focused={focused} accentColor={theme.accent} />;
    };

  return (
    <Tabs
      screenOptions={{
        header: () => <TopBar />,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.divider, borderTopWidth: 1.5 },
        tabBarLabelStyle: { fontFamily: AppFonts.heading, fontSize: 11 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: renderIcon('home-outline') }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario', tabBarIcon: renderIcon('calendar-outline') }} />
      <Tabs.Screen
        name="despensa"
        options={{ title: 'Despensa', tabBarIcon: renderIcon('nutrition-outline'), headerShown: false }}
      />
      <Tabs.Screen
        name="entrenamiento"
        options={{ title: 'Entrenamiento', tabBarIcon: renderIcon('barbell-outline') }}
      />
    </Tabs>
  );
}
