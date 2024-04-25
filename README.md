# Website des Queeren Zentrums Kassel

Eine Sveltekit-App, die Inhalt aus Contentful bezieht.

## Loslegen

Du kannst die Website auf deinem PC ausführen, um Änderungen schneller zu sehen und Probleme zu identifizieren.

> Diese Anleitung ist für Menschen gedacht, die nicht mit der Kommandozeile vertraut sind. Informationen für Profis sind weiter unten.

### Schritt 1: Software installieren

Zum Starten der Website benötigst du `git` und `node`:

- [Git für Windows](https://git-scm.com/download/win) (erster Link)
- [Nodejs für Windows](https://nodejs.org/en/download)

Deine Plattform ist höchstwahrscheinlich x64 bzw. 64-bit.

### Schritt 2: Quellcode klonen

Zum Klonen wird `git` benötigt. Um den Prozess zu vereinfachen, gibt es ein Skript, das du herunterladen kannst.

1. Öffne das Skript über [diesen Link](https://raw.githubusercontent.com/Aloso/qzk/main/scripts/internal/clone-website.bat) und lade die Datei mit <kbd>Strg+S</kbd> herunter.

2. Verschiebe die Datei in den Ordner, wo der Quellcode landen soll (z.B. `Dokumente`).

3. Führe die Datei per Doppelklick aus.

Wenn der Prozess abgeschlossen ist, sollte ein Ordner "Queeres Zentrum Website" erscheinen. Du kannst du das Skript dann löschen.

### Schritt 3: Geheime Datei

Im Code fehlt eine Datei namens `.env` mit Passwörtern und vertraulichen Informationen. Diese erhältst du auf Anfrage separat. Füge die Datei im Ordner "Queeres Zentrum Website" ein.

> **Wichtig**: Diese Datei darf nicht veröffentlicht werden, da sonst jeder Mensch den Inhalt der Website bearbeiten oder löschen kann.

### Schritt 4: Abhängigkeiten installieren

Im Ordner "Queeres Zentrum Website" befindet sich ein Ordner "scripts". Öffne ihn und führe die Datei `Installation.bat` durch einen Doppelklick aus.

## Verwendung der Skripte

In dem Ordner "scripts" befinden sich noch weitere Dateien. Führe `Hilfe.bat` aus, um eine Zusammenfassung zu erhalten.

Mit `Start.bat` wird die Website auf deinem PC geöffnet. Die URL dafür beginnt `localhost`, da es eine _lokale_ Website ist – sie ist nur auf deinem PC erreichbar. Wenn du Änderungen in Contentful vornimmst, werden sie lokal sofort sichtbar, du musst dafür nur die Seite neu laden. Du musst den Inhalt _nicht_ veröffentlichen, um ihn auf der lokalen Website zu sehen.

Mit `Test.bat` wird die Website kompiliert. Du musst nicht verstehen, was das bedeutet. Wichtig ist, dass dabei alles auf Korrektheit überprüft wird. Wenn eine Seite einen Fehler enthält, wird er dir angezeigt. Ein besonders häufiger Fehler ist eine **ungültige URL**. Die Fehlermeldung enthält dann den Code `404`. Sie sagt dir außerdem, auf welcher Seite der Fehler aufgetreten ist, damit du ihn korrigieren kannst.

Wenn etwas am Code der Website geändert wurde, musst du `Update.bat` ausführen, um die Änderungen auch lokal zu übernehmen; ansonsten verwendest du einen veralteten Stand der Website. Es ist sinnvoll, das immer vor dem Ausführen von `Start.bat` zu tun, falls das letzte Update schon einen Tag oder länger zurückliegt. Wenn du `Update.bat` ausführst, ohne dass sich der Code geändert hat, macht das nichts.

## Anleitung für Profis

Benötigt: Node.js, pnpm

- Installiere dependencies mit `pnpm install`

- Kopiere die Datei `.env.example` nach `.env` und ersetze die fehlenden Werte (diese findest du in den Einstellungen von Contentful).

- Öffne die Website lokal mit `npm run dev -- --open`

- Baue die Website für Produktion mit `npm run build`

## Lizenz

Der Code in diesem Repository ist unter der [MIT Lizenz](https://opensource.org/license/mit) verfügbar. Diese Lizenz erlaubt dir die Verwendung des Codes ohne irgendwelchen Einschränkungen.

Die Schriftarten sind unter der [SIL Open Font License (OFL)](https://openfontlicense.org/) verfügbar.

Die Grafiken sind derzeit nicht lizensiert, d.h. vor einer nicht-privaten Verwendung ist die Zustimmung der Urheber\*innen notwendig.
