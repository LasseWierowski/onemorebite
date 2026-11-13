# Nachschlag – MVP-Plan (iOS)

> Arbeitstitel „Nachschlag" (Name vor Launch per Marken- und App-Store-Suche prüfen).
> Repo-Name ist `onemorebite` — welcher Name gewinnt, ist offen.

> Für Claude Code: Diese Datei ist die Spezifikation. Arbeite die Phasen **der Reihe nach** ab.
> Nach jeder Phase: bauen, Tests laufen lassen, kurz zusammenfassen, auf mein OK warten.

> **Stack-Wechsel (13.11.2026):** Ursprünglich war dieser Plan für SwiftUI/SwiftData geschrieben.
> Umgestellt auf **React Native mit Expo**, damit die App ohne Mac und ohne Xcode entwickelt und
> per Expo Go direkt auf dem iPhone getestet werden kann. Die Produktsubstanz (Abschnitte 1–3, 7, 8)
> ist unverändert. Die Original-Swift-Fassung steht in der Git-History (Commit `958770e`).
> Was der Wechsel kostet, steht in Abschnitt 4 unter „Was wir dafür aufgeben".

## 1. Produkt in einem Satz
Eine iOS-App für Leute, denen Zunehmen schwerfällt: Essen per Foto/Sprache in Sekunden loggen,
sehen wie weit man vom Tagesziel weg ist, und rechtzeitig konkrete, kaloriendichte Vorschläge bekommen.

## 2. Positionierung: Die einfachste Zunehm-App

Der Markt ist voll mit englischsprachigen „AI Bulking Trackers“. Wir gewinnen nicht über mehr Features, sondern über **weniger Aufwand**.
Die Konkurrenz scheitert an: zu aufwendigem Loggen (die meisten hören nach 1–2 Wochen auf), Abo-Fallen und Werbung,
ungenauen KI-Schätzungen ohne einfache Korrektur und Tagesziel-Druck an Tagen ohne Appetit.

**Design-Regeln (gelten für jede Entscheidung):**
1. **Ein Eintrag dauert maximal 3 Sekunden.** Häufiges Essen per Tipp, nicht per Suche.
2. **Nur zwei Zahlen:** kcal und Protein. Keine Kohlenhydrate/Fette in der UI, keine Mikronährstoffe.
3. **Keine Gramm.** Portionen werden mit „kleiner / normal / größer“ korrigiert.
4. **Die App sagt, was zu tun ist**, statt Daten zu zeigen („Trink jetzt einen Shake“).
5. **Kein Schuldgefühl.** Kein Rot, keine „Ziel verfehlt“-Meldungen. Ein schwacher Tag wird über die Woche ausgeglichen.
6. **Ehrliches Abo:** Preis vor dem Start sichtbar, Erinnerung vor Ende der Testphase, keine Werbung, keine Upsell-Popups.
7. **Komplett auf Deutsch**, mit deutschen Supermarkt-Lebensmitteln und Portionen.

## 3. MVP-Umfang

**Drin:**
1. Onboarding mit **höchstens 4 Fragen** (Gewicht, Größe, Alter, Geschlecht; Aktivität mit sinnvollem Standardwert) → Ziel wird automatisch berechnet
2. **Automatische Gewohnheits-Erkennung:** Die App erkennt Gerichte, die der Nutzer öfter isst, und legt sie selbst als
   Schnell-Gerichte an. Diese erscheinen passend zur Tageszeit als Kacheln, im Widget, in Erinnerungen und über Siri.
   Der Nutzer muss nie selbst Favoriten anlegen.
3. Mahlzeit loggen per **Foto**, **Sprache** oder **Text** → KI schätzt → Bestätigen mit einem Tipp, Portion per „kleiner / normal / größer“ (×0,7 / ×1 / ×1,4)
4. **Heute-Screen**: ein großer Ring (kcal), kleine Protein-Anzeige, Button „Was jetzt?“, Schnell-Buttons. Sonst nichts.
5. **Wochenkonto**: Ziel gilt pro Woche; ein schwacher Tag erhöht die Ziele der nächsten Tage leicht (max. +15 %)
6. **Rückstands-Erinnerungen** (lokale Notifications) mit konkretem Vorschlag
7. **Snack-/Shake-Bibliothek** (statisch, kuratiert, ohne KI)
8. **Interaktives Widget** (Home- und Sperrbildschirm): Ring + die 2–4 Schnell-Gerichte, die zur aktuellen Tageszeit passen; loggen ohne die App zu öffnen
8b. **Siri & Kurzbefehle:** „Hey Siri, Nachschlag: Shake“ loggt das Schnell-Gericht
8c. **Loggen aus der Erinnerung:** Benachrichtigungen haben einen Button „Wie immer: Shake loggen“
9. **Gewicht** + 7-Tage-Durchschnitt; die App schlägt selbst vor, das Ziel anzupassen, wenn nichts passiert
10. **Abo** (StoreKit 2) mit 7 Tagen Testphase, transparente Paywall
11. **Backend-Proxy** für KI-Aufrufe mit Rate Limit

**Nicht im MVP (v2):** Kassenbon-Scan / Kühlschrank-Inventar, Apple Health Sync, Social, Android.
**Bewusst nie:** Makro-Details, Lebensmitteldatenbank-Suche als Hauptweg, Werbung, Streak-Strafen.

> **Zur Expo-Go-Grenze:** Punkte 8, 8b und 8c (Widget, Siri, Loggen aus der Benachrichtigung)
> sowie Punkt 10 (Abo) brauchen einen Dev-Build und laufen nicht in Expo Go. Details und die
> empfohlene Reihenfolge stehen in Abschnitt 4 und Abschnitt 10.

## 4. Tech-Stack

| Bereich | Wahl | Grund |
|---|---|---|
| UI | **React Native**, Expo SDK 58, iOS 17+ | Läuft in Expo Go auf dem iPhone, kein Mac nötig |
| Navigation | **expo-router** (file-based, `src/app/`) | Standard im Expo-Ökosystem |
| Sprache | **TypeScript** (strict, `noUncheckedIndexedAccess`) | |
| Architektur | Reine Logik in `src/core/`, Views ohne Rechnen | Testbar ohne Gerät |
| State | Zustand (ab Phase 1) | Wenig Boilerplate |
| Lokale Daten | **expo-sqlite** + dünne Repository-Schicht | Offline-first, in Expo Go enthalten |
| Animation | **react-native-reanimated** 4 + Gesture Handler | Läuft auf dem UI-Thread, unterbrechbar |
| Ring & Charts | **react-native-svg** | In Expo Go enthalten, kein Chart-Framework nötig |
| Foto | `expo-image-picker` + `expo-camera` | In Expo Go enthalten |
| KI | Anthropic API (Haiku-Klasse, Modell per Env-Variable) | Günstig, Vision, JSON |
| Backend | **Supabase**: Auth + Edge Function als KI-Proxy + Tabelle `usage` | API-Key bleibt auf dem Server, Rate Limit |
| Notifications | `expo-notifications` (lokal, mit Action-Buttons) | Kein Push-Server nötig |
| Tests | Jest (`jest-expo` Preset) | |
| Builds | **EAS Build** (Expos Cloud) | Kein Mac für TestFlight nötig |

**Wichtig:** Der Anthropic-API-Key kommt **niemals** in die App. Nur `EXPO_PUBLIC_*`-Variablen
landen im Bundle und sind damit öffentlich.

### Die Expo-Go-Grenze

Expo Go enthält nur die von Expo mitgelieferten native Module. Alles mit eigenem nativem Code
braucht einen **Dev-Build** (`eas build --profile development`, läuft in Expos Cloud, kein Mac).

- **Phase 0 bis 5 laufen in Expo Go.** QR-Code scannen, fertig.
- **Phase 5b (Widget, Siri) und Phase 6 (Abo) brauchen einen Dev-Build** und einen
  Apple Developer Account (99 €/Jahr).

### Was wir dafür aufgeben

| Original (Swift) | Jetzt | Preis |
|---|---|---|
| Speech Framework, on-device, kostenlos | Audio aufnehmen → serverseitig transkribieren | **Kostet pro Nutzung Geld.** Entscheidung in Phase 4. |
| WidgetKit + App Intents direkt | Config-Plugin mit nativem Swift-Code | Phase 5b wird deutlich teurer |
| StoreKit 2 direkt | `expo-iap` oder RevenueCat | Dev-Build nötig |
| SwiftData | expo-sqlite + eigene Repository-Schicht | Etwas mehr Handarbeit |

Gewonnen: Entwicklung ohne Mac, Tests in der Cloud, ein Stack für Edge Functions und App.

## 5. Projektstruktur

```
src/
├─ app/                    expo-router. Jede Datei = ein Screen. NUR Routen.
│  ├─ _layout.tsx          GestureHandlerRootView + Stack
│  ├─ +not-found.tsx
│  └─ (tabs)/              index (Heute) / gewicht / einstellungen
├─ core/                   REINE LOGIK. Keine React-/Expo-/react-native-Importe.
│  ├─ time.ts              Tagesgrenze (4 Uhr)                   ✅ Phase 0
│  ├─ goals.ts             Mifflin-St-Jeor, Proteinziel              Phase 1
│  ├─ habits.ts            Erkennen, Lernen, Befördern, Ranking      Phase 1b
│  ├─ weekBudget.ts        Wochenkonto                               Phase 1b
│  ├─ suggestions.ts       Snack-Auswahl                             Phase 2
│  ├─ reminders.ts         Notification-Planung                      Phase 3
│  └─ trend.ts             Gewichtstrend                             Phase 5
├─ db/                     expo-sqlite: Schema, Migrationen, Repositories
├─ stores/                 Zustand
├─ ui/                     Komponenten (Ring, Kachel, Portionswahl, ...)
└─ theme.ts                Design-Tokens: Farben, Raster, Typo, Motion
assets/
supabase/
├─ functions/analyze-meal/index.ts
└─ migrations/001_usage.sql
```

Pfad-Alias `@/` → `src/`, konfiguriert in `tsconfig.json` **und** `jest.config.js`.

`src/core/` ist die wichtigste Regel: Zeitpunkte und Daten werden **übergeben**, nie
aus `Date.now()` oder der DB gelesen. Nur so sind „morgens vs. abends" und „schwacher Tag"
testbar — und nur so läuft die Prüfung in einer Cloud-Session ohne Gerät durch.

## 6. Datenmodell

TypeScript-Typen in `src/db/`, persistiert in SQLite. Alle Zeitstempel als ISO-String,
alle Tagesbezüge als `DayKey` (`"YYYY-MM-DD"`, Tagesgrenze 4 Uhr, siehe `src/core/time.ts`).

```ts
type UserProfile = {
  weightKg: number; heightCm: number; age: number;
  sex: 'm' | 'w';
  activityLevel: 1 | 2 | 3 | 4 | 5;
  goalSurplusKcal: number;        // Standard 400
  kcalTarget: number; proteinTarget: number;
  wakeTime: string; sleepTime: string;   // "07:30" — für Erinnerungen
};

type FoodEntry = {
  id: string; at: string; day: DayKey;
  name: string;
  kcal: number; proteinG: number;
  source: 'photo' | 'voice' | 'text' | 'library' | 'dish';
  dishKey: string | null;
  aiConfidence: number | null;    // 0–1
};

type WeightEntry = { day: DayKey; kg: number };

type Dish = {                     // ein wiederkehrendes Gericht
  key: string;                    // PRIMARY KEY, z.B. "haferflocken_milch_banane"
  displayName: string; emoji: string;
  avgKcal: number; avgProtein: number;  // gleitender Mittelwert der *korrigierten* Werte
  count: number; lastUsed: string;
  hourHistogram: number[];        // 24 Fächer: wann wird es gegessen
  isQuick: boolean;               // automatisch befördert
  isPinned: boolean; isHidden: boolean;
};
```

`hourHistogram` wird als JSON-Spalte gespeichert. Für 24 Zahlen pro Gericht ist eine
Nebentabelle nicht gerechtfertigt.

## 7. Kernlogik

**Ziel (Onboarding):** Mifflin-St-Jeor-Grundumsatz × Aktivitätsfaktor + Überschuss (Standard +400 kcal).
Protein: 1,8 g × kg Körpergewicht. Werte im Onboarding anzeigen und editierbar machen.

**Rückstands-Erinnerungen (`core/reminders.ts`):**
- Checkpoints zwischen Aufwachen und Schlafen, z. B. bei 25 %, 50 %, 75 % und 90 % des Tages.
- Soll-Fortschritt am Checkpoint = linear (z. B. 50 % des Tages → 45 % der kcal, mit etwas Puffer).
- **Nach jedem Log-Eintrag:** alle Notifications für heute löschen und neu planen. Wer auf Kurs ist, bekommt
  am nächsten Checkpoint keine Benachrichtigung. Wer im Rückstand ist, bekommt eine konkrete Nachricht mit
  einem Snack-Vorschlag aus der Bibliothek, z. B. „Du bist bei 38 %. Ein Erdnussbutter-Bananen-Shake (850 kcal) bringt dich auf 70 %.“
- Maximal 4 Notifications pro Tag, nicht nach der Schlafenszeit.

**Wochenkonto:** `weeklyTarget = kcalTarget × 7`. Tagesziel = (Wochenziel − bisher gegessen) / verbleibende Tage,
begrenzt auf 85–115 % des Basisziels. Der Ring zeigt immer das angepasste Tagesziel.
Ein Tag mit < 70 % wird nicht rot markiert, sondern es erscheint der Hinweis „Kein Problem, morgen ein Shake extra“.

**Gewohnheits-Erkennung (`core/habits.ts`, reine Logik + Tests):**
1. *Erkennen:* Jede KI-Antwort enthält einen `dish_key` (normalisierter deutscher Name, snake_case, ohne Mengen).
   Die App schickt die Schlüssel der bis zu 30 bekannten Gerichte mit, damit die KI bei gleichem Gericht denselben Schlüssel
   wiederverwendet („Porridge“ = „haferflocken_milch“). Ohne KI (Text-Log) gilt ein einfacher Vergleich: Kleinschreibung,
   Füllwörter entfernen, Ähnlichkeit ≥ 0,85.
2. *Lernen:* Nach jedem bestätigten Eintrag wird `Dish` aktualisiert: count +1, lastUsed, hourHistogram, und `avgKcal`
   als gleitender Mittelwert der *korrigierten* Werte. So wird jedes Gericht mit der Zeit genauer.
3. *Befördern:* **3× in 14 Tagen** → `isQuick = true`. Dann kommt ein kurzer Hinweis:
   „🍌 Erdnuss-Shake liegt jetzt in deinem Schnellzugriff.“ (mit Rückgängig). Wird ein Gericht 30 Tage nicht gegessen, verschwindet es wieder
   (außer es ist angepinnt).
4. *Ranking nach Kontext:* `score = log(1+count) × Aktualitäts-Abfall(lastUsed, Halbwertszeit 10 Tage) × (0,3 + Anteil des Histogramms ±1,5 h um jetzt)`.
   Morgens stehen also die Haferflocken vorne, abends das Abendessen.
5. *Ein Tipp = loggen:* Schnell-Gerichte werden mit `avgKcal/avgProtein` **ohne KI-Aufruf** geloggt. Das spart Tokens:
   Je mehr Gewohnheiten erkannt sind, desto billiger wird ein Nutzer.
6. *Combos (wenn Zeit ist):* Zwei Gerichte, die ≥ 3× innerhalb von 20 Minuten zusammen geloggt wurden, werden ein Combo
   („Frühstück wie immer“, 1 Tipp für beide).

Überall, wo Schnell-Gerichte auftauchen (Heute-Screen, Widget, Benachrichtigungen, Siri), wird dieselbe Rangliste verwendet.
Lange drücken auf eine Kachel öffnet: Anpinnen / Ausblenden / Umbenennen / kcal anpassen.

**Vorschläge (ohne KI):** `assets/snackLibrary.json` mit ~100 Einträgen
`{id, name, kcal, protein, prepMinutes, tags:["shake","no-cook","sweet","savory"], ingredients:[...]}`.
Vorschlag = Einträge filtern, deren kcal ≈ fehlende kcal / verbleibende Mahlzeiten, sortiert nach kcal-Dichte und Zubereitungszeit.

## 8. KI-Proxy (Supabase Edge Function `analyze-meal`)

**Request:** `{ type: "photo" | "text", text?: string, imageBase64?: string, knownDishes: [{key, name}] }` (max. 30) + Supabase-JWT.
Sprache wird **in der App** zu Text, dann als `type:"text"` gesendet.

**Ablauf:**
1. JWT prüfen → user_id
2. Rate Limit: `usage`-Tabelle, max. **20 Aufrufe/Tag** (Testphase und Abo gleich), sonst 429
3. Bild serverseitig prüfen: max. 1 MB (die App skaliert vorher auf ~1024 px lange Kante, JPEG 0,7)
4. Anthropic-Aufruf, Modell aus Env-Variable `AI_MODEL`
5. Antwort als JSON validieren, Usage hochzählen, Tokens loggen (zur Kostenkontrolle)

**Systemprompt (Entwurf):**
```
Du schätzt Nährwerte von Mahlzeiten. Antworte NUR mit JSON:
{"dish_key":string,"display_name":string,"emoji":string,"items":[{"name":string,"kcal":int,"protein_g":int}],"total_kcal":int,"total_protein_g":int,"confidence":0-1}
Wenn das Gericht einem der bekannten Gerichte entspricht, verwende exakt dessen dish_key. Sonst bilde einen neuen
(deutsch, snake_case, Hauptzutaten, ohne Mengen).
Nutze deutsche Portionsgrößen. Wenn unklar, nimm eine realistische Durchschnittsportion und senke confidence.
```

**Migration `001_usage.sql`:** Tabelle `usage(user_id uuid, day date, calls int, input_tokens int, output_tokens int, primary key(user_id, day))` + RLS.

## 9. Abo

- Produkte: `bulk.monthly` 4,99 €, `bulk.yearly` 29,99 €, beide mit 7 Tagen kostenloser
  Testphase (in App Store Connect einrichten).
- Umsetzung mit **`expo-iap`** oder **RevenueCat** — Entscheidung in Phase 6, nachdem die
  App auf echten Nutzern lief. Beides braucht einen Dev-Build.
- Paywall nach dem Onboarding. Ohne aktives Abo bzw. Testphase kein Loggen
  (Gewicht eintragen und Ansehen gehen weiter).
- Die Paywall zeigt Preis und Datum der ersten Abbuchung im Klartext. Eine lokale
  Benachrichtigung 2 Tage vor Ende der Testphase. Danach nie wieder Abo-Popups im Alltag.
- (Später: Abo-Status serverseitig per App Store Server API prüfen, damit das Rate Limit
  am Abo hängt.)

## 10. Phasen

Jede Phase nennt, was **in der Cloud** prüfbar ist (Typecheck, Lint, Tests, Metro-Bundling)
und was nur **auf dem iPhone** prüfbar ist. Das ist keine Formalie: eine Cloud-Session läuft
auf Linux, ohne Xcode, Simulator oder Gerät.

### Phase 0 – Setup ✅
- Expo-Projekt, TypeScript strict, expo-router mit 3 Tabs (Heute / Gewicht / Einstellungen),
  ESLint, Prettier, Jest, `.env.example`, Design-Tokens, `src/core/time.ts` mit Tagesgrenze.
- **Fertig, wenn:** `npm run check` grün ist, `npx expo export --platform ios` durchläuft,
  und die App in Expo Go mit leeren Tabs startet. ✅

### Phase 1 – Onboarding + Heute-Screen + Text-Log (ohne KI)
- Onboarding (max. 4 Fragen), `core/goals.ts` mit Unit-Tests.
- Heute-Screen: großer kcal-Ring (SVG), kleine Protein-Anzeige, Eintragsliste (Wischen zum Löschen).
- Manuelles Loggen: Name + kcal + Protein. SQLite-Persistenz.
- *Cloud:* Zielberechnung, Repository-Schicht. *iPhone:* Ring, Wischgeste, Tastatur-Verhalten.
- **Fertig, wenn:** man ein Profil anlegen kann, Einträge den Ring füllen und das einen
  App-Neustart übersteht.

### Phase 1b – Einfachheit + Gewohnheiten
- `core/habits.ts`: Erkennen (Textvergleich, Ähnlichkeit ≥ 0,85), Lernen (gleitender
  Mittelwert der korrigierten Werte), Befördern (3× in 14 Tagen), Ranking nach Tageszeit.
- Schnell-Kacheln auf dem Heute-Screen, Beförderungs-Hinweis mit Rückgängig,
  Kontextmenü je Kachel (Anpinnen / Ausblenden / Umbenennen / kcal anpassen).
- Portions-Korrektur „kleiner / normal / größer", `core/weekBudget.ts`.
- *Cloud:* fast alles — das ist die am besten testbare Phase.
- **Fertig, wenn:** ein dreimal geloggtes Gericht automatisch zur Kachel wird, Tests mit
  fixer Uhrzeit beweisen, dass morgens andere Kacheln vorne stehen als abends, und ein
  schwacher Tag das Ziel der Folgetage korrekt anhebt.

### Phase 2 – Snack-Bibliothek + Vorschläge
- `assets/snackLibrary.json`, mindestens 60 kaloriendichte Einträge, Schwerpunkt Shakes,
  deutsche Supermarkt-Zutaten.
- Button „Was jetzt?" → 3 passende Vorschläge → mit einem Tipp loggen.
- *Cloud:* komplett.
- **Fertig, wenn:** die Vorschläge sich an den fehlenden kcal orientieren und es einen Test
  für die Auswahl-Logik gibt.

### Phase 3 – Rückstands-Erinnerungen
- `core/reminders.ts`: `plan(now, profile, consumed) → PlannedNotification[]` als reine Funktion.
- Zustellung über `expo-notifications`, Berechtigung im Onboarding anfragen.
- *Cloud:* die Planungslogik. *iPhone:* ob die Benachrichtigungen wirklich eintreffen.
- **Fertig, wenn:** die Tests „auf Kurs / im Rückstand / spät abends" abdecken und ein
  Debug-Screen die geplanten Notifications anzeigt.

### Phase 4 – Backend + KI
- Supabase-Projekt, Migration `001_usage.sql`, Edge Function `analyze-meal`.
- `src/services/ai.ts` in der App; Foto-Log (auf ~1024 px skalieren, JPEG 0,7 → senden →
  Bestätigen mit editierbaren Werten).
- Fehlerfälle: offline, 429-Limit, ungültiges JSON → verständliche Meldung, manuelles
  Eintragen immer als Fallback.
- **Zwei offene Entscheidungen:** (a) Sprach-Log serverseitig transkribieren (kostet Geld)
  oder auf den Dev-Build verschieben, (b) Sign in with Apple oder erstmal anonyme Supabase-Auth.
- *Cloud:* Edge Function und Validierung. *iPhone:* Kamera, Bildgröße, Ladezeiten.
- **Fertig, wenn:** ein Foto von einem Teller Nudeln einen plausiblen Eintrag erzeugt und
  das Limit nachweislich greift.

### Phase 5 – Gewicht + Trend
- Gewicht eintragen, SVG-Linie mit 7-Tage-Durchschnitt, Zunahme pro Woche.
- Hinweis bei < 0,1 kg/Woche über 2 Wochen: „Erhöhe dein Ziel um 200 kcal?"
- *Cloud:* `core/trend.ts` komplett.
- **Fertig, wenn:** der Trend korrekt berechnet wird (mit Test).

---

**Hier endet Expo Go.** Alles darunter braucht einen EAS Dev-Build und einen Apple
Developer Account.

**Empfehlung:** TestFlight schon nach Phase 5 anstreben, mit Notification-Action-Buttons
als Widget-Ersatz (die gehen in Expo Go). Erst echte Nutzer, dann die teure Phase 5b.

### Phase 5b – Widget + Siri
- Config-Plugin mit nativem Swift-Code: WidgetKit-Extension, App Group für den geteilten
  Store, App Intents für Siri und die interaktiven Widget-Buttons.
- Ring + Top-Schnell-Gerichte (klein: 2, mittel: 4), Sperrbildschirm-Variante (Ring + 1 Gericht).
- Timeline mit einem Eintrag pro Stunde, damit die Kacheln zur Tageszeit wechseln.
- Notification-Action „Wie immer: <Top-Gericht> loggen", loggt ohne App-Öffnen.
- Überall dieselbe Rangliste aus `core/habits.ts`.
- *Cloud:* nichts davon — nativer Swift-Code lässt sich hier nicht kompilieren.
- **Fertig, wenn:** ein Tipp im Widget einen Eintrag anlegt und der Ring sich ohne App-Start
  aktualisiert, das Widget um 8 Uhr andere Gerichte zeigt als um 19 Uhr, und Siri sowie der
  Benachrichtigungs-Button loggen.

### Phase 6 – Abo + Paywall
- Wie in Abschnitt 9.
- **Fertig, wenn:** Kauf, Testphase, Ablauf und Wiederherstellen in der Sandbox funktionieren.

### Phase 7 – Feinschliff + TestFlight
- App-Icon, Leerzustände, Haptik beim Loggen, deutsche Texte durchgehen,
  Berechtigungstexte für Kamera und Mikrofon in `app.json`.
- Datenschutzerklärung + Privacy-Angaben in App Store Connect
  (**Fotos gehen an einen KI-Anbieter → muss offengelegt werden**).
- **Fertig, wenn:** ein TestFlight-Build hochgeladen ist.

## 11. Regeln für Claude Code

- Kleine Commits pro Teilschritt. **Keine neuen Abhängigkeiten ohne Rückfrage.**
- Abhängigkeiten nur in SDK-kompatiblen Versionen: `npx expo install <paket>`, oder wenn
  das Netz blockt, die Version aus `node_modules/expo/bundledNativeModules.json` ablesen.
- Geschäftslogik (Ziele, Gewohnheiten, Erinnerungen, Vorschläge, Trend) als reine,
  getestete Funktionen in `src/core/` — nicht in Views, nicht in Stores.
- Alle UI-Texte auf Deutsch.
- Keine Secrets im Repo. Supabase-URL und Anon-Key über `.env.local` (gitignored),
  Vorlage ist `.env.example`.
- `ios/` und `android/` nie anlegen oder editieren (Continuous Native Generation).
- Vor jedem „fertig": `npm run check`.
