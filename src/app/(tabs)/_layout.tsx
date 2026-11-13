import { Tabs } from 'expo-router';

import { useColors } from '@/ui/useColors';

export default function TabsLayout() {
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.bg, borderTopColor: c.separator },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Heute' }} />
      <Tabs.Screen name="gewicht" options={{ title: 'Gewicht' }} />
      <Tabs.Screen name="einstellungen" options={{ title: 'Einstellungen' }} />
    </Tabs>
  );
}
