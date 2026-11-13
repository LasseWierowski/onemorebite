import {
  DEFAULT_DAY_START_HOUR,
  dayKey,
  isSameLoggingDay,
  lastDayKeys,
  startOfLoggingDay,
} from '@/core/time';

/** Lokale Zeit, damit die Tests unabhängig von der Zeitzone laufen. */
const at = (y: number, m: number, d: number, h: number, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0);

describe('dayKey', () => {
  it('ordnet den Vormittag dem Kalendertag zu', () => {
    expect(dayKey(at(2026, 3, 14, 9))).toBe('2026-03-14');
  });

  it('ordnet den Abend dem Kalendertag zu', () => {
    expect(dayKey(at(2026, 3, 14, 23, 30))).toBe('2026-03-14');
  });

  it('ordnet 1 Uhr nachts noch dem Vortag zu', () => {
    expect(dayKey(at(2026, 3, 15, 1))).toBe('2026-03-14');
  });

  it('wechselt den Tag exakt um 4 Uhr', () => {
    expect(dayKey(at(2026, 3, 15, 3, 59))).toBe('2026-03-14');
    expect(dayKey(at(2026, 3, 15, 4, 0))).toBe('2026-03-15');
  });

  it('geht über eine Monatsgrenze zurück', () => {
    expect(dayKey(at(2026, 4, 1, 2))).toBe('2026-03-31');
  });

  it('geht über eine Jahresgrenze zurück', () => {
    expect(dayKey(at(2026, 1, 1, 2))).toBe('2025-12-31');
  });

  it('respektiert eine abweichende Tagesgrenze', () => {
    expect(dayKey(at(2026, 3, 15, 5), 6)).toBe('2026-03-14');
    expect(dayKey(at(2026, 3, 15, 5), 0)).toBe('2026-03-15');
  });
});

describe('startOfLoggingDay', () => {
  it('liefert 4 Uhr des zugehörigen Tages', () => {
    const start = startOfLoggingDay(at(2026, 3, 15, 1, 30));
    expect(start.getDate()).toBe(14);
    expect(start.getHours()).toBe(DEFAULT_DAY_START_HOUR);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
    expect(start.getMilliseconds()).toBe(0);
  });

  it('verändert das übergebene Datum nicht', () => {
    const input = at(2026, 3, 15, 1, 30);
    const copy = new Date(input.getTime());
    startOfLoggingDay(input);
    expect(input.getTime()).toBe(copy.getTime());
  });
});

describe('isSameLoggingDay', () => {
  it('fasst 23 Uhr und 1 Uhr danach zusammen', () => {
    expect(isSameLoggingDay(at(2026, 3, 14, 23), at(2026, 3, 15, 1))).toBe(true);
  });

  it('trennt 3 Uhr und 5 Uhr derselben Nacht', () => {
    expect(isSameLoggingDay(at(2026, 3, 15, 3), at(2026, 3, 15, 5))).toBe(false);
  });
});

describe('lastDayKeys', () => {
  it('liefert sieben Tage, ältester zuerst', () => {
    expect(lastDayKeys(at(2026, 3, 14, 12), 7)).toEqual([
      '2026-03-08',
      '2026-03-09',
      '2026-03-10',
      '2026-03-11',
      '2026-03-12',
      '2026-03-13',
      '2026-03-14',
    ]);
  });

  it('nimmt nachts den Vortag als letzten Tag', () => {
    const keys = lastDayKeys(at(2026, 3, 15, 2), 3);
    expect(keys).toEqual(['2026-03-12', '2026-03-13', '2026-03-14']);
  });

  it('liefert für count <= 0 eine leere Liste', () => {
    expect(lastDayKeys(at(2026, 3, 14, 12), 0)).toEqual([]);
    expect(lastDayKeys(at(2026, 3, 14, 12), -3)).toEqual([]);
  });
});
