# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Projektsprache ist **Deutsch**: UI-Texte, Commits, Kommentare und Antworten an den Nutzer.
Code-Identifier bleiben englisch.

## Was das ist

Eine iOS-App für Leute, denen Zunehmen schwerfällt. Essen in Sekunden loggen, sehen wie weit
man vom Tagesziel weg ist, rechtzeitig kaloriendichte Vorschläge bekommen.
Arbeitstitel „Nachschlag".

**`PLAN.md` ist die Spezifikation.** Phasen der Reihe nach abarbeiten, nach jeder Phase bauen,
testen, zusammenfassen und auf OK warten. Vor Architekturentscheidungen dort nachlesen.

## Befehle

Alle verifiziert in diesem Repo:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint
npm test             # jest
npm run check        # alle drei hintereinander — vor jedem "fertig"
npm start            # Dev-Server; QR-Code mit Expo Go auf dem iPhone scannen
```

Einzelner Test:

```bash
npx jest src/core/time.test.ts
npx jest -t 'wechselt den Tag exakt um 4 Uhr'
```

Prüfen, ob die App überhaupt bündelt (geht auch ohne Mac und ohne Gerät):

```bash
npx expo export --platform ios --output-dir /tmp/export-check
```

## Diese Umgebung kann die App nicht ausführen

Cloud-Sessions laufen auf **Linux**. Kein Xcode, kein Simulator, kein iPhone.
Hier verifizierbar: Typecheck, Lint, Tests, Metro-Bundling.
**Nicht** verifizierbar: wie es aussieht, ob es sich gut anfühlt, Kamera, Mikrofon,
Notifications, Haptik. Das läuft über Expo Go auf dem iPhone des Nutzers.

Niemals behaupten, etwas sei visuell oder auf dem Gerät geprüft. Stattdessen sagen,
was geprüft wurde und was der Nutzer auf dem iPhone ansehen muss.

### Gesperrte Hosts

Die Netzwerk-Policy blockt `api.expo.dev`, `docs.expo.dev` und `reactnative.directory`
(403 beim CONNECT). Folgen:

- **`npx expo install` funktioniert nicht** — es braucht `api.expo.dev` zur Versionsauflösung.
  Ersatz: Die SDK-kompatible Versionsmatrix liegt lokal in
  `node_modules/expo/bundledNativeModules.json`. Dort die Version nachsehen und exakt so
  mit `npm install` setzen. Das ist dasselbe Ergebnis, das `expo install` gewählt hätte.
- `npx expo-doctor` und `eas build` gehen hier nicht, nur lokal auf dem Mac.
- Die Docs-Regel aus `AGENTS.md` lässt sich hier nicht befolgen. Bei Unsicherheit über eine
  Expo-API: im installierten Paket in `node_modules/` nachsehen (Typdefinitionen, README,
  Quellcode) statt aus dem Gedächtnis zu antworten.

## Architektur

```
src/
├─ app/        expo-router. Jede Datei = ein Screen. NUR Routen, nichts anderes.
│  ├─ _layout.tsx        GestureHandlerRootView + Stack
│  └─ (tabs)/            Heute (index) / Gewicht / Einstellungen
├─ core/       REINE LOGIK. Keine React-, Expo- oder react-native-Importe. Vollständig getestet.
├─ ui/         Wiederverwendbare Komponenten
└─ theme.ts    Design-Tokens
```

Pfad-Alias: `@/` → `src/`. Konfiguriert in `tsconfig.json` **und** `jest.config.js` —
beide ändern, wenn sich das verschiebt.

### Die zentrale Regel: Logik nach `src/core/`

Jede Geschäftsregel — Zielberechnung, Gewohnheits-Erkennung, Wochenkonto, Vorschlagsauswahl,
Erinnerungsplanung, Gewichtstrend — ist eine **reine Funktion** in `src/core/` mit Tests.
Kein Zugriff auf `Date.now()`, kein Zugriff auf die DB: Zeitpunkte und Daten werden
**übergeben**. Nur so sind Szenarien wie „morgens vs. abends" oder „schwacher Tag" testbar,
und nur so läuft die Prüfung in dieser Umgebung durch.

Views lesen Werte und rufen Logik auf. Views berechnen nichts.

### Tagesgrenze

Der Logging-Tag beginnt um **4 Uhr morgens**, nicht um Mitternacht (`src/core/time.ts`).
Ein Shake um 1 Uhr zählt auf den Vortag. Mitternacht als Grenze würde den Nutzer morgens
mit scheinbarem Rückstand und abends mit scheinbar verfehltem Ziel bestrafen — das verstößt
gegen „Kein Schuldgefühl" (PLAN.md Regel 5).

## Produktregeln, die jede Entscheidung binden

Aus `PLAN.md` Abschnitt 2. Diese schlagen technische Eleganz:

1. **Ein Eintrag dauert maximal 3 Sekunden.** Häufiges Essen per Tipp, nicht per Suche.
2. **Nur zwei Zahlen:** kcal und Protein. Keine Kohlenhydrate, Fette, Mikronährstoffe in der UI.
3. **Keine Gramm.** Portionen nur „kleiner / normal / größer" (×0,7 / ×1 / ×1,4).
4. **Die App sagt, was zu tun ist**, statt Daten zu zeigen.
5. **Kein Schuldgefühl.** Kein Rot, keine „Ziel verfehlt"-Meldung. Kein `#FF0000` im Theme —
   wenn eine Warnfarbe nötig scheint, ist das Feature falsch gedacht.
6. **Ehrliches Abo.** Preis vorher sichtbar, keine Upsell-Popups im Alltag.
7. **Komplett Deutsch**, deutsche Supermarkt-Lebensmittel und Portionen.

Jedes erkannte Gewohnheits-Gericht wird **ohne KI-Aufruf** geloggt. Die `habitEngine` ist
damit nicht nur Bequemlichkeit, sondern die Kostenbremse.

## Expo-Regeln

`AGENTS.md` im Repo-Root enthält die von Expo gepflegten Regeln. Die wichtigsten:

- **Dem Trainingswissen nicht trauen.** Expo bricht APIs pro SDK-Release. Vor dem Schreiben
  von Expo-API-Code nachsehen — hier in `node_modules/`, lokal in den Docs.
- **`ios/` und `android/` nie anlegen oder bearbeiten.** Continuous Native Generation.
  Natives Verhalten über `app.json` und Config-Plugins.
- **Expo Go enthält nur seine mitgelieferten native Module.** Eine Library mit nativem Code
  erfordert einen Dev-Build. Das ist die Grenze zwischen Phase 5 und 5b.

### Versionen, die nicht „aufgeräumt" werden dürfen

- `react-dom` ist auf exakt `19.3.0` gepinnt. SDK 58 verlangt das; `jest-expo` zieht sonst
  `19.3.1` und die Installation bricht mit einem Peer-Konflikt.
- `react-native-reanimated` ist auf `4.7.1` gepinnt (SDK-Vorgabe, ohne Range).
- **Keine `babel.config.js` anlegen.** `babel-preset-expo` fügt das
  `react-native-worklets/plugin` automatisch hinzu, sobald `react-native-worklets`
  installiert ist. Manuell hinzugefügt wäre es doppelt und würde brechen.

## Frontend-Bau

Zwei Skills liegen unter `.claude/skills/` (siehe dortige README):

- **`animate-expo`** für jede Animation, Geste, Haptik und Screen-Transition. Das ist das
  richtige Skill für Code.
- **`apple-design`** für Prinzipien. Achtung: dort sind die Beispiele Web (CSS, Framer Motion).
  Übersetzung nach RN: `prefers-reduced-motion` → `useReducedMotion()` aus Reanimated,
  `backdrop-filter` → `expo-blur`, Pointer Events → Gesture Handler.

`src/theme.ts` erzwingt zwei dieser Prinzipien, statt sie nur zu dokumentieren:
`typeScale` setzt Tracking und Leading **pro Größe** (große Zahlen negativ getrackt und eng,
kleiner Text positiv und luftig), und `motion` enthält Apples Damping-Ratio/Response als
Reanimated-Tokens — `motion.standard` ist kritisch gedämpft, Überschwingen nur nach einer
Geste mit Impuls (`motion.momentum`).

Text skaliert mit der Systemeinstellung des Nutzers. Containern deshalb keine festen Höhen
geben, sonst bricht das Layout bei großer Schrift.

## Secrets

Der Anthropic-API-Key kommt **niemals** in die App. Die App ruft ausschließlich die
Supabase Edge Function auf, der Key lebt dort als Server-Secret.

Nur `EXPO_PUBLIC_*`-Variablen landen im Bundle, sind also öffentlich. Vorlage: `.env.example`
→ `.env.local` (gitignored).

## Git

Entwicklungsbranch: `claude/confident-lovelace-fc8bq0`. Kleine Commits pro Teilschritt.
Keine neuen Abhängigkeiten ohne Rückfrage.
