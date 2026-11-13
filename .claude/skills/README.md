# Skills in diesem Projekt

Projekt-Skills liegen im Repo (nicht in `~/.claude/`), damit sie überall gelten:
in Cloud-Sessions, lokal auf dem Mac und für jeden, der das Repo klont.

## Fremde Skills (vendored)

| Skill | Quelle | Lizenz | Warum |
|---|---|---|---|
| `animate-expo` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | Animationen in React Native/Expo: Reanimated, Gesture Handler, Expo Router, `expo-haptics`. Deckt genau unseren Stack ab. |
| `apple-design` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | Apples Design- und Motion-Prinzipien (WWDC). Achtung: Die Code-Beispiele darin sind für Web (CSS/Framer Motion), nicht React Native — die **Prinzipien** übertragen sich, der Code nicht. Für Code `animate-expo` nehmen. |

Bewusst **nicht** übernommen: `mobile-native` (zielt auf Web-Apps auf dem Handy und
verweist selbst auf `animate-expo` für React Native).

Aktualisieren: Datei aus dem Quell-Repo neu kopieren, `LICENSE` dabei lassen.
