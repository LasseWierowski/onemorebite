import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { space, typeScale } from '@/theme';
import { useColors } from '@/ui/useColors';

export default function NotFoundScreen() {
  const c = useColors();
  return (
    <>
      <Stack.Screen options={{ title: 'Nicht gefunden' }} />
      <View style={[styles.root, { backgroundColor: c.bg }]}>
        <Text style={[styles.title, { color: c.text }]}>Diese Seite gibt es nicht.</Text>
        <Link href="/" style={[styles.link, { color: c.accent }]}>
          Zurück zu Heute
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  title: typeScale.body,
  link: { ...typeScale.body, fontWeight: '600' },
});
