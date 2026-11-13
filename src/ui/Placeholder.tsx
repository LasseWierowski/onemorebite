import { StyleSheet, Text, View } from 'react-native';

import { space, typeScale } from '@/theme';
import { useColors } from '@/ui/useColors';

type Props = {
  title: string;
  /** Welche Phase aus PLAN.md diesen Screen füllt. */
  phase: string;
};

/** Platzhalter für Phase 0. Wird Screen für Screen ersetzt. */
export function Placeholder({ title, phase }: Props) {
  const c = useColors();
  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      <Text style={[styles.phase, { color: c.textMuted }]}>{phase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: space.lg,
  },
  title: typeScale.title,
  phase: { ...typeScale.label, textAlign: 'center' },
});
