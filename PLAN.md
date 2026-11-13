# Nachschlag – MVP-Plan (iOS)

> Arbeitstitel „Nachschlag“ (Name vor Launch per Marken- und App-Store-Suche prüfen).

> Für Claude Code: Diese Datei ist die Spezifikation. Arbeite die Phasen **der Reihe nach** ab.
> Nach jeder Phase: bauen, Tests laufen lassen, kurz zusammenfassen, auf mein OK warten.

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

## 4. Tech-Stack

| Bereich | Wahl | Grund |
|---|---|---|
| UI | **SwiftUI**, iOS 17+ | Modern, wenig Boilerplate |
| Architektur | MVVM mit `@Observable` | Einfach, gut testbar |
| Lokale Daten | **SwiftData** | Offline-first, kein Sync nötig fürs MVP |
| Sprache → Text | **Speech Framework** (`SFSpeechRecognizer`, on-device, `de-DE`) | Kostenlos, keine Tokens |
| Foto | `PhotosPicker` + Kamera (`UIImagePickerController`-Wrapper) | Standard |
| KI | Anthropic API (Haiku-Klasse, Modell per Config wechselbar) | Günstig, Vision, JSON |
| Backend | **Supabase**: Auth (Sign in with Apple) + Edge Function als KI-Proxy + Tabelle `usage` | API-Key bleibt auf dem Server, Rate Limit |
| Abo | **StoreKit 2** direkt (optional später RevenueCat) | Keine Zusatzkosten |
| Notifications | `UNUserNotificationCenter` (lokal) | Kein Push-Server nötig |
| Tests | Swift Testing / XCTest | |

**Wichtig:** Der Anthropic-API-Key kommt **niemals** in die App. Die App ruft nur die Supabase Edge Function auf.

## 5. Projektstruktur

```
BulkApp/
├─ App/                 BulkApp.swift, RootView, AppState
├─ Features/
│  ├─ Onboarding/       OnboardingView, GoalCalculator
│  ├─ Today/            TodayView, TodayViewModel, ProgressRing
│  ├─ Log/              LogSheet, PhotoLogView, VoiceLogView, TextLogView, ConfirmEntryView
│  ├─ Suggestions/      SuggestionView, SnackLibrary.json
│  ├─ QuickAdd/        QuickAddGrid, PortionPicker, DishContextMenu
│  ├─ Weight/           WeightView, WeightTrendChart (Swift Charts)
│  ├─ Paywall/          PaywallView, SubscriptionManager
│  └─ Settings/
├─ Models/              SwiftData-Modelle
├─ Services/
│  ├─ AIService.swift          → ruft Edge Function auf
│  ├─ HabitEngine.swift        → Gewohnheiten erkennen, lernen, ranken
│  ├─ SpeechService.swift
│  ├─ NotificationScheduler.swift
│  └─ AuthService.swift
├─ Resources/           SnackLibrary.json, Localizable (de)
└─ Tests/
supabase/
├─ functions/analyze-meal/index.ts
└─ migrations/001_usage.sql
```

## 6. Datenmodell (SwiftData)

```swift
@Model class UserProfile {
  var weightKg: Double; var heightCm: Double; var age: Int
  var sex: String            // "m" / "w"
  var activityLevel: Int     // 1–5
  var goalSurplusKcal: Int   // Standard 400
  var kcalTarget: Int; var proteinTarget: Int
  var wakeTime: Date; var sleepTime: Date   // für Erinnerungen
}

@Model class FoodEntry {
  var id: UUID; var date: Date
  var name: String
  var kcal: Int; var proteinG: Int
  var source: String         // "photo" | "voice" | "text" | "library"
  var aiConfidence: Double?  // 0–1
}

@Model class WeightEntry { var date: Date; var kg: Double }

@Model class Dish {                // ein wiederkehrendes Gericht
  @Attribute(.unique) var key: String   // z. B. "haferflocken_milch_banane"
  var displayName: String; var emoji: String
  var avgKcal: Int; var avgProtein: Int // laufender Mittelwert der vom Nutzer bestätigten Werte
  var count: Int; var lastUsed: Date
  var hourHistogram: [Int]               // 24 Fächer: wann wird es gegessen
  var isQuick: Bool                      // automatisch befördert
  var isPinned: Bool; var isHidden: Bool // Nutzer kann anpinnen oder ausblenden
}
// FoodEntry bekommt zusätzlich: var dishKey: String?
```

## 7. Kernlogik

**Ziel (Onboarding):** Mifflin-St-Jeor-Grundumsatz × Aktivitätsfaktor + Überschuss (Standard +400 kcal).
Protein: 1,8 g × kg Körpergewicht. Werte im Onboarding anzeigen und editierbar machen.

**Rückstands-Erinnerungen (`NotificationScheduler`):**
- Checkpoints zwischen Aufwachen und Schlafen, z. B. bei 25 %, 50 %, 75 % und 90 % des Tages.
- Soll-Fortschritt am Checkpoint = linear (z. B. 50 % des Tages → 45 % der kcal, mit etwas Puffer).
- **Nach jedem Log-Eintrag:** alle Notifications für heute löschen und neu planen. Wer auf Kurs ist, bekommt
  am nächsten Checkpoint keine Benachrichtigung. Wer im Rückstand ist, bekommt eine konkrete Nachricht mit
  einem Snack-Vorschlag aus der Bibliothek, z. B. „Du bist bei 38 %. Ein Erdnussbutter-Bananen-Shake (850 kcal) bringt dich auf 70 %.“
- Maximal 4 Notifications pro Tag, nicht nach der Schlafenszeit.

**Wochenkonto:** `weeklyTarget = kcalTarget × 7`. Tagesziel = (Wochenziel − bisher gegessen) / verbleibende Tage,
begrenzt auf 85–115 % des Basisziels. Der Ring zeigt immer das angepasste Tagesziel.
Ein Tag mit < 70 % wird nicht rot markiert, sondern es erscheint der Hinweis „Kein Problem, morgen ein Shake extra“.

**Gewohnheits-Erkennung (`HabitEngine`, reine Logik + Tests):**
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

**Vorschläge (ohne KI):** `SnackLibrary.json` mit ~100 Einträgen
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

## 9. Abo (StoreKit 2)
- Produkte: `bulk.monthly` 4,99 €, `bulk.yearly` 29,99 €, beide mit 7 Tagen kostenloser Testphase (in App Store Connect einrichten).
- `SubscriptionManager`: Produkte laden, kaufen, `Transaction.currentEntitlements` prüfen, `Transaction.updates` beobachten.
- Paywall nach dem Onboarding. Ohne aktives Abo bzw. Testphase kein Loggen (Gewicht und Ansehen gehen weiter).
- Die Paywall zeigt den Preis und das Datum der ersten Abbuchung im Klartext. Eine lokale Benachrichtigung 2 Tage vor Ende der Testphase.
  Danach nie wieder Abo-Popups im Alltag.
- Lokaler Test mit einer `.storekit`-Konfigurationsdatei.
- (Später: Abo-Status serverseitig per App Store Server API prüfen, damit das Rate Limit am Abo hängt.)

## 10. Phasen

### Phase 0 – Setup
- Xcode-Projekt (SwiftUI, iOS 17), Ordnerstruktur wie oben, SwiftData-Container, Tab-Navigation (Heute / Gewicht / Einstellungen).
- **Fertig, wenn:** die App startet im Simulator mit leeren Tabs.

### Phase 1 – Onboarding + Heute-Screen + Text-Log (ohne KI)
- Onboarding-Flow, `GoalCalculator` mit Unit-Tests.
- Heute-Screen mit Fortschrittsringen (kcal, Protein) und Eintragsliste (Wischen zum Löschen).
- Manuelles Loggen: Name + kcal + Protein.
- **Fertig, wenn:** man ein Profil anlegen kann, Einträge den Ring füllen und das nach einem Neustart erhalten bleibt.

### Phase 1b – Einfachheit + Gewohnheiten
- `Dish`-Modell, `HabitEngine` (Erkennen per Textvergleich, Lernen, Befördern, Ranking), Schnell-Kacheln auf dem Heute-Screen,
  Beförderungs-Hinweis, Kontextmenü an jeder Kachel.
- Portions-Korrektur „kleiner / normal / größer“, Wochenkonto-Logik (reine Funktion + Tests).
- **Fertig, wenn:** ein dreimal geloggtes Gericht automatisch zur Kachel wird, morgens andere Kacheln vorne stehen als abends
  (Test mit festgelegter Uhrzeit), und ein schwacher Tag das Ziel der Folgetage korrekt anhebt.

### Phase 2 – Snack-Bibliothek + Vorschläge
- `SnackLibrary.json` mit mindestens 60 kaloriendichten Einträgen (Schwerpunkt Shakes, deutsche Supermarkt-Zutaten).
- Button „Was jetzt?“ → 3 passende Vorschläge → mit einem Tipp loggen.
- **Fertig, wenn:** die Vorschläge sich an den fehlenden kcal orientieren und es einen Test für die Auswahl-Logik gibt.

### Phase 3 – Rückstands-Erinnerungen
- `NotificationScheduler` wie in Abschnitt 7, Berechtigung im Onboarding anfragen.
- Logik als reine Funktion `plan(now:, profile:, consumed:) -> [PlannedNotification]` mit Unit-Tests.
- **Fertig, wenn:** die Tests verschiedene Szenarien abdecken (auf Kurs / im Rückstand / spät abends) und ein Debug-Screen die geplanten Notifications anzeigt.

### Phase 4 – Backend + KI
- Supabase-Projekt, Sign in with Apple, Migration, Edge Function `analyze-meal`.
- `AIService` in der App; Foto-Log (skalieren → senden → `ConfirmEntryView` mit editierbaren Werten).
- Sprach-Log mit `SpeechService` (on-device, de-DE) → Text → KI → Bestätigen.
- Fehlerfälle: offline, 429-Limit, ungültiges JSON → verständliche Meldung + manuelles Eintragen als Fallback.
- **Fertig, wenn:** ein Foto von einem Teller Nudeln einen plausiblen Eintrag erzeugt und das Limit nachweislich greift.

### Phase 5 – Gewicht + Trend
- Gewicht eintragen, Swift-Charts-Linie mit 7-Tage-Durchschnitt, Zunahme pro Woche.
- Hinweis bei < 0,1 kg/Woche über 2 Wochen: „Erhöhe dein Ziel um 200 kcal?“
- **Fertig, wenn:** der Trend korrekt berechnet wird (mit Test).

### Phase 5b – Widget
- WidgetKit-Extension mit App Group (geteilter SwiftData-Store). Ring + Top-Schnell-Gerichte aus der `HabitEngine`
  (klein: 2, mittel: 4), Buttons über App Intents (interaktive Widgets ab iOS 17), Sperrbildschirm-Variante (Ring + 1 Gericht).
- Timeline mit einem Eintrag pro Stunde, damit die Kacheln zur Tageszeit wechseln. Nach jedem Log `WidgetCenter.reloadAllTimelines()`.
- `Dish` als `AppEntity` → App Intent „Gericht loggen“ für Siri und Kurzbefehle („Hey Siri, Nachschlag: Shake“).
- Erinnerungen bekommen eine Notification-Action „Wie immer: <Top-Gericht> loggen“, die ohne App-Öffnen loggt.
- **Fertig, wenn:** ein Tipp im Widget einen Eintrag anlegt und der Ring sich ohne App-Start aktualisiert, das Widget um 8 Uhr
  andere Gerichte zeigt als um 19 Uhr, und Siri sowie der Benachrichtigungs-Button loggen.

### Phase 6 – Abo + Paywall
- Wie in Abschnitt 9. Test mit `.storekit`-Datei.
- **Fertig, wenn:** Kauf, Testphase, Ablauf und Wiederherstellen im Simulator funktionieren.

### Phase 7 – Feinschliff + TestFlight
- App-Icon, Leerzustände, Haptik beim Loggen, deutsche Texte, Datenschutz-Hinweise (Kamera, Mikrofon, Spracherkennung in der Info.plist).
- Datenschutzerklärung + Privacy-Angaben in App Store Connect (Fotos gehen an einen KI-Anbieter → offenlegen).
- **Fertig, wenn:** ein TestFlight-Build hochgeladen ist.

## 11. Regeln für Claude Code
- Kleine Commits pro Teilschritt. Keine neuen Abhängigkeiten ohne Rückfrage (außer `supabase-swift`).
- Geschäftslogik (Ziele, Erinnerungen, Vorschläge, Trend) als reine, getestete Funktionen außerhalb der Views.
- Alle UI-Texte auf Deutsch.
- Keine Secrets im Repo. Supabase-URL und Anon-Key in `Config.xcconfig` (gitignored), mit einer `Config.example.xcconfig` als Vorlage.
