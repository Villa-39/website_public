# Villa 39 – Website

Quellcode der Website [dievilla39.de](https://dievilla39.de): Wir kämpfen dafür, die Villa 39 in Würzburg-Frauenland als bezahlbaren, selbstverwalteten Wohnraum zu erhalten, und sammeln dafür Direktkredite (nach dem Modell des Mietshäuser-Syndikats).

Die Seite besteht aus reinem HTML, CSS und etwas JavaScript. Es gibt keinen Build-Schritt und keine Abhängigkeiten: Was im Repo liegt, ist die Website.

## Aufbau

| Datei / Ordner | Inhalt |
|---|---|
| `index.html` | Startseite (Worum es geht, Aktuelles, Direktkredit, Anreißer zu Geschichte und Finanzierung, Newsletter, Kontakt) |
| `geschichte.html`, `finanzierung.html`, `direktkredit.html`, `aktuelles.html` | Unterseiten |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten |
| `404.html` | Fehlerseite |
| `style.css` | Das gesamte Design |
| `news.json` | Meldungen für „Aktuelles" |
| `fortschritt.json`, `fortschritt.js` | Fortschrittsbalken mit Meilensteinen |
| `images/` | Bilder |
| `fonts/` | Schriften (selbst gehostet, mit Lizenzen) |
| `sitemap.xml`, `robots.txt` | Für Suchmaschinen |

## Inhalte pflegen

### Meldungen („Aktuelles")
Neue Meldungen kommen in `news.json`. Jeder Eintrag hat:

- `date` (`JJJJ-MM-TT`), `title`, `text` – Pflicht
- `image` und `imageAlt` – optional (Bildpfad und Bildbeschreibung)
- `eventDate` (`JJJJ-MM-TT`) – optional, für Veranstaltungen mit Termin
- `id` – optional, für Direktlinks (`aktuelles.html#id`)

Auf der Startseite werden lange Texte nach einer festen Zeichenzahl am Wortende gekürzt (`TEASER_LIMIT` in `index.html`). Die Unterseite zeigt den vollen Text.

### Fortschrittsbalken
In `fortschritt.json` stehen:

- `aktuell` – der aktuelle Stand in Euro
- `ziel` – das Zwischenziel in Euro
- `stand` – Datum der letzten Aktualisierung (`JJJJ-MM-TT`)
- `meilensteine` – Liste von Abschnitten mit `titel` und `betrag` (Größe des Abschnitts in Euro; die Abschnitte werden der Reihe nach gefüllt)

Zum Aktualisieren genügt es, `aktuell` und `stand` zu ändern. Fehlt die Datei oder ist sie ungültig, bleibt der Balken einfach unsichtbar.

### Texte und Bilder
Texte stehen direkt in den HTML-Dateien. Bilder liegen in `images/`. Neue Bilder bitte vor dem Hochladen verkleinern (Breite ca. 1600 px, möglichst unter 500 KB) und immer mit sinnvollem `alt`-Text einbinden.

## Lokal ansehen
Wegen der JSON-Dateien reicht ein Doppelklick auf `index.html` nicht. Stattdessen im Ordner einen kleinen Webserver starten:

```
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen.

## Veröffentlichen
Die Seite wird über GitHub Pages ausgeliefert, direkt vom Hauptzweig (`main`). Jede Änderung dort ist nach ein bis zwei Minuten live. Die Domain `dievilla39.de` ist bei netcup registriert und per DNS mit GitHub Pages verbunden.

## Worauf man achten muss
- **Das Menü steht in jeder HTML-Datei einzeln.** Wer einen Menüpunkt ändert, muss ihn in allen Seiten ändern (auf der Startseite sind es Anker, auf den Unterseiten Links auf die jeweilige Seite).
- **Neue Seite?** Dann auch in `sitemap.xml` eintragen, mit Titel, Beschreibung und `canonical`-Link versehen und bei Bedarf im Menü ergänzen.
- **Vor jedem Commit** prüfen, dass keine Platzhalter („[Platzhalter …]") und keine Testzahlen mehr drinstehen.
- **Nichts Privates einchecken.** Das Repo ist öffentlich, auch gelöschte Dateien bleiben in der Historie sichtbar.
- **Rechtliches:** Impressum und Datenschutzerklärung müssen zur Seite passen. Wer einen neuen Dienst einbindet (z. B. ein Formular, Karten oder Videos), ergänzt die Datenschutzerklärung.

## Externe Dienste
- **Newsletter:** Brevo (Anmeldeformular auf der Startseite). Der Absender `newsletter@dievilla39.de` ist über ImprovMX an unser Postfach weitergeleitet.
- **Suche:** Google Search Console (Verifizierung per DNS-Eintrag).

## Lizenz und Kontakt
Texte und Bilder: © Villa 39, alle Rechte vorbehalten. Die Schriften Archivo Black und IBM Plex Mono stehen unter der SIL Open Font License (siehe `fonts/`).

Kontakt: [villa39@gmx.de](mailto:villa39@gmx.de)
