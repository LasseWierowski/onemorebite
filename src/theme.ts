/**
 * Design-Tokens. Bewusst klein gehalten.
 *
 * Zwei Regeln aus PLAN.md sind hier verankert:
 * - Kein Rot, keine Warnfarben. Ein schwacher Tag ist kein Fehler (Regel 5).
 * - Nur zwei Zahlen in der UI: kcal und Protein (Regel 2).
 */

export type Colors = {
  bg: string;
  bgElevated: string;
  text: string;
  textMuted: string;
  separator: string;
  /** Unausgefüllter Teil des Fortschrittsrings. */
  track: string;
  /** kcal-Fortschritt. Warm, nie alarmierend. */
  accent: string;
  accentSoft: string;
  /** Protein-Anzeige. */
  protein: string;
};

export const light: Colors = {
  bg: '#FFFFFF',
  bgElevated: '#F5F5F7',
  text: '#11181C',
  textMuted: '#6B7280',
  separator: '#E4E4E7',
  track: '#ECECEF',
  accent: '#E8833A',
  accentSoft: '#F6C9A3',
  protein: '#5B8DEF',
};

export const dark: Colors = {
  bg: '#0B0B0C',
  bgElevated: '#1A1A1C',
  text: '#F2F2F4',
  textMuted: '#9BA1A6',
  separator: '#2A2A2D',
  track: '#2A2A2D',
  accent: '#F2904A',
  accentSoft: '#7A4A22',
  protein: '#7BA4F5',
};

/** 4er-Raster. */
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;

/**
 * Typografie-Skala.
 *
 * Tracking und Leading sind pro Größe gesetzt, nicht global: große Zahlen
 * brauchen negatives Tracking und enges Leading, kleiner Text positives
 * Tracking und mehr Luft. Ein fester letterSpacing-Wert wäre irgendwo falsch.
 *
 * `fontSize` ist absichtlich nicht hart verdrahtet in Komponenten — RN skaliert
 * Text standardmäßig mit der Systemeinstellung (allowFontScaling), deshalb
 * dürfen Container keine festen Höhen bekommen.
 */
export const typeScale = {
  /** Die große kcal-Zahl im Ring. */
  hero: { fontSize: 48, lineHeight: 50, letterSpacing: -1.0, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, letterSpacing: -0.3, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24, letterSpacing: 0, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, letterSpacing: 0.2, fontWeight: '500' },
} as const;

/**
 * Bewegung. Apples Damping-Ratio/Response, übersetzt auf Reanimated:
 * `withSpring(v, motion.standard)`.
 *
 * Default ist kritisch gedämpft (kein Überschwingen). Bounce gibt es nur,
 * wenn die Geste selbst Impuls hatte — ein Sheet, das geworfen wurde, darf
 * überschwingen; eine Kachel, die nur erscheint, nicht.
 */
export const motion = {
  /** Standard für alles Angefasste: ruhig, ohne Nachwippen. */
  standard: { dampingRatio: 1.0, duration: 400 },
  /** Schnelles Press-Feedback. */
  press: { dampingRatio: 1.0, duration: 150 },
  /** Nach einem Wisch oder Wurf: leichter Nachschwung. */
  momentum: { dampingRatio: 0.8, duration: 400 },
  /** Sheets und Drawer. */
  sheet: { dampingRatio: 0.8, duration: 300 },
} as const;

/** Verkleinerung beim Drücken. Feedback kommt auf pointer-down, nicht erst beim Loslassen. */
export const pressScale = 0.97;
