/**
 * Tagesgrenzen. Reine Logik, keine React- oder Expo-Importe.
 *
 * Warum nicht Mitternacht: Wer um 1 Uhr nachts noch einen Shake trinkt, hat
 * das für *gestern* getan, nicht für heute. Würde dieser Eintrag auf den neuen
 * Tag zählen, stünde der Nutzer morgens schon im Rückstand und abends mit
 * einem scheinbar verfehlten Ziel da. Das verstößt gegen Regel 5 aus PLAN.md
 * ("Kein Schuldgefühl"). Der Logging-Tag beginnt deshalb um 4 Uhr morgens.
 */

/** Kalendertag im Format "YYYY-MM-DD". */
export type DayKey = string;

export const DEFAULT_DAY_START_HOUR = 4;

/** Beginn des Logging-Tages, in dem `date` liegt. */
export function startOfLoggingDay(date: Date, dayStartHour = DEFAULT_DAY_START_HOUR): Date {
  const d = new Date(date.getTime());
  if (d.getHours() < dayStartHour) {
    d.setDate(d.getDate() - 1);
  }
  d.setHours(dayStartHour, 0, 0, 0);
  return d;
}

/** Schlüssel des Logging-Tages, in dem `date` liegt. */
export function dayKey(date: Date, dayStartHour = DEFAULT_DAY_START_HOUR): DayKey {
  const start = startOfLoggingDay(date, dayStartHour);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Liegen beide Zeitpunkte im selben Logging-Tag? */
export function isSameLoggingDay(
  a: Date,
  b: Date,
  dayStartHour = DEFAULT_DAY_START_HOUR,
): boolean {
  return dayKey(a, dayStartHour) === dayKey(b, dayStartHour);
}

/**
 * Die letzten `count` Logging-Tage, ältester zuerst, `date` als letzter.
 * Für Wochenkonto (Phase 1b) und Gewichtstrend (Phase 5).
 */
export function lastDayKeys(
  date: Date,
  count: number,
  dayStartHour = DEFAULT_DAY_START_HOUR,
): DayKey[] {
  if (count <= 0) return [];
  const keys: DayKey[] = [];
  const cursor = startOfLoggingDay(date, dayStartHour);
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(cursor.getTime());
    d.setDate(d.getDate() - i);
    keys.push(dayKey(d, dayStartHour));
  }
  return keys;
}
