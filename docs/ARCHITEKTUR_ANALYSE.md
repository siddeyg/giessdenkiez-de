# Gieß den Kiez: Technische Architekturanalyse und Optimierungspotenziale

**Datum der Analyse:** 16. November 2025
**Projektversion:** 3.0.0-beta.0
**Autor:** Technische Architekturanalyse

---

## Zusammenfassung

Gieß den Kiez ist eine innovative Civic-Tech-Plattform, die seit Mai 2020 Bürgerinnen und Bürger Berlins dabei unterstützt, die städtischen Straßen- und Parkbäume durch gemeinschaftliches Gießen zu pflegen. Die Plattform zeigt nahezu alle der über 400.000 Berliner Bäume mit detaillierten Informationen zu Wasserbedarf, Alter und Art. Diese tiefgehende technische Analyse untersucht die aktuelle Architektur, identifiziert Herausforderungen bei der Bereitstellung und schlägt konkrete Verbesserungen vor.

---

## 1. Projektkontext und gesellschaftliche Relevanz

Die Auswirkungen des Klimawandels, insbesondere die trockenen und heißen Sommer der letzten Jahre, stellen eine erhebliche Belastung für die städtische grüne Infrastruktur dar. Gieß den Kiez adressiert diese Herausforderung durch die Demokratisierung von Umweltdaten und die Aktivierung zivilgesellschaftlichen Engagements.

### Mission und Ziele

Das Projekt verfolgt mehrere komplementäre Ziele:

**Informationsbereitstellung:** Bürgerinnen und Bürger erhalten Zugang zu einer umfassenden Datenbank aller Straßen- und Parkbäume in ihrer Nachbarschaft. Für jeden Baum werden detaillierte Informationen bereitgestellt, darunter botanischer und deutscher Name, Pflanzjahr, Höhe, Bezirk und Eigentumsverhältnisse.

**Bedarfsermittlung:** Die Plattform berechnet den individuellen Wasserbedarf jedes Baumes basierend auf einem ausgeklügelten Algorithmus, der Baumalter, Niederschlagsdaten des Deutschen Wetterdienstes und bereits erfolgte Bewässerungen berücksichtigt.

**Community-Engagement:** Durch Gamification-Elemente wie Baumadoptionen, Gießprotokollierung und Statistiken wird eine aktive Community von Baumpaten aufgebaut. Nutzer können Bäume adoptieren, Bewässerungen dokumentieren und ihren Beitrag zur städtischen Grünpflege nachverfolgen.

**Datenvisualisierung:** Die interaktive Kartenansicht basierend auf Mapbox GL ermöglicht es, den Zustand der Bäume visuell zu erfassen. Bäume werden farbcodiert dargestellt: Grün für ausreichend bewässert, Gelb und Orange für unterschiedlich hohen Wasserbedarf.

### Gesellschaftliche Wirkung

Seit der Einführung im Mai 2020 hat Gieß den Kiez nachweislich zur Stärkung des Umweltbewusstseins und zur aktiven Beteiligung an der Stadtgestaltung beigetragen. Das Projekt demonstriert eindrucksvoll, wie Open-Source-Software und offene Daten zur Lösung realer städtischer Herausforderungen eingesetzt werden können.

Die Plattform wurde bereits von mehreren anderen Städten adaptiert, was die Übertragbarkeit des Konzepts unterstreicht. Die Technologiestiftung Berlin bietet über "DeineStadt Gießt" professionelle Unterstützung für Städte an, die eine eigene Instanz der Plattform betreiben möchten.

---

## 2. Technische Architektur im Detail

### 2.1 Multi-Repository-Struktur

Eine der charakteristischen Eigenschaften von Gieß den Kiez ist die Aufteilung in vier separate Git-Repositories, die jeweils unterschiedliche Verantwortlichkeiten übernehmen:

**Frontend-Repository (giessdenkiez-de):** Die React-basierte Webanwendung bildet die Benutzeroberfläche. Mit über 15.000 Zeilen TypeScript-Code und 168 React-Komponenten ist dies das größte und komplexeste Repository. Die Anwendung nutzt moderne Web-Technologien wie Vite als Build-Tool, Zustand für State Management und Mapbox GL für die Kartendarstellung.

**Backend-Repository (giessdenkiez-de-postgres-api):** Dieses Repository enthält das Datenbankschema, Migrationen und Supabase Edge Functions. Es definiert die PostgreSQL-Datenstruktur mit PostGIS-Erweiterungen für geospatiale Abfragen sowie benutzerdefinierte SQL-Funktionen für komplexe Datenoperationen.

**DWD-Harvester-Repository (giessdenkiez-de-dwd-harvester):** Ein Python-basierter Datenverarbeitungsprozess, der stündlich aktualisierte RADOLAN-Niederschlagsdaten vom Deutschen Wetterdienst bezieht, verarbeitet und mit den Baumstandorten verknüpft. Dieser Harvester generiert auch die Mapbox-Vektortilesets, die im Frontend verwendet werden.

**OSM-Pumpen-Harvester (giessdenkiez-de-osm-pumpen-harvester):** Ein kleineres Python-Skript, das Standorte öffentlicher Wasserpumpen aus OpenStreetMap extrahiert und als GeoJSON-Datei bereitstellt, um Nutzern beim Gießen zu helfen.

Diese Architektur bietet Vorteile hinsichtlich der Trennung von Verantwortlichkeiten und unabhängiger Versionierung, führt aber auch zu erheblichen Herausforderungen bei der Entwicklung und Bereitstellung.

### 2.2 Frontend-Technologiestack

Die Wahl des Frontend-Stacks zeigt eine durchdachte Balance zwischen Entwicklerproduktivität und Performance:

**React 18.3.1** bildet das Fundament mit seinem komponentenbasierten Ansatz. Die Verwendung von Function Components und Hooks entspricht modernen Best Practices. Mit 168 Komponenten ist die Anwendung gut strukturiert und folgt dem Feature-Based-Organization-Muster.

**TypeScript 5.6.2 im Strict Mode** gewährleistet Typsicherheit auf höchstem Niveau. Die Compiler-Konfiguration aktiviert alle strengen Optionen einschließlich `noUnusedLocals`, `noUnusedParameters` und `noFallthroughCasesInSwitch`. Dies führt zu einer erheblichen Reduktion von Laufzeitfehlern und verbessert die Wartbarkeit signifikant.

**Vite 5.4.8** als Build-Tool repräsentiert den aktuellen Stand der Technik. Im Vergleich zu älteren Tools wie Webpack bietet Vite dramatisch schnellere Entwicklungsserver-Startzeiten (unter 1 Sekunde) und nahezu instantane Hot Module Replacement (HMR). Die native ESM-Unterstützung und das optimierte Bundling resultieren in einem Production-Build von etwa 180 KB (gzip).

**Zustand 4.5.5** für State Management ist eine bemerkenswerte Designentscheidung. Anstelle von Redux, das in vielen vergleichbaren Projekten zum Einsatz kommt, wurde Zustand gewählt. Diese Bibliothek reduziert Boilerplate-Code um etwa 90%, benötigt keine Provider-Wrapper und bietet dennoch alle notwendigen Funktionen. Mit 15 unabhängigen Stores (auth-store, profile-store, tree-store, map-store, filter-store, etc.) wird der State elegant auf verschiedene Domänen verteilt.

**Mapbox GL 3.8.0** ermöglicht die Darstellung von über 400.000 Bäumen mit exzellenter Performance. Die GPU-beschleunigte Rendering-Engine kann Vektorkacheln in Echtzeit rendern und bietet Funktionen wie 45-Grad-Neigung, Zoom-abhängiges Styling und interaktive Overlays.

**Tailwind CSS 3.4.13** beschleunigt die UI-Entwicklung erheblich. Die Utility-First-Philosophie ermöglicht schnelles Prototyping, während das Purging ungenutzte Styles entfernt und so die finale CSS-Datei auf etwa 15 KB reduziert. Die Konfiguration verwendet eine benutzerdefinierte Farbpalette, die an die Berliner Markenidentität angepasst ist, sowie die IBM Plex Sans Schriftfamilie.

**D3.js 7.9.0** wird gezielt für Datenvisualisierungen eingesetzt, insbesondere für die gestapelten Fortschrittskreise, die den Wasserbedarf visualisieren. Durch Tree-Shaking werden nur die tatsächlich verwendeten Funktionen im Bundle inkludiert, was die Größe auf etwa 70 KB begrenzt.

### 2.3 Backend-Architektur und Datenmodell

Die Backend-Architektur basiert vollständig auf Supabase, einem Open-Source-Alternative zu Firebase:

**PostgreSQL 15 mit PostGIS 3.4** bildet die Datenschicht. PostGIS erweitert PostgreSQL um geospatiale Funktionen, die für die Speicherung und Abfrage von Baumkoordinaten essenziell sind. Die `geom`-Spalte in der `trees`-Tabelle verwendet den Datentyp `GEOMETRY(Point, 4326)`, was WGS84-Koordinaten entspricht.

Das **Datenbankschema** umfasst mehrere Kerntabellen:

Die `trees`-Tabelle speichert über 400.000 Datensätze mit Spalten für ID, Koordinaten, botanischen und deutschen Artnamen, Gattung, Pflanzjahr, Alter, Höhe, Bezirk, Eigentümer und die PostGIS-Geometrie. Besonders bemerkenswert ist die `radolan_days`-Spalte vom Typ `INTEGER[]`, die 720 stündliche Niederschlagswerte (30 Tage × 24 Stunden) pro Baum speichert. Dies entspricht 288 Millionen Datenpunkten für alle Bäume.

Die `trees_watered`-Tabelle protokolliert alle Gießereignisse mit Zeitstempel, Litermenge, Baum-ID und User-ID. Diese Daten fließen in die Wasserbedarfsberechnung ein.

Die `trees_adopted`-Tabelle verknüpft Nutzer mit ihren adoptierten Bäumen und ermöglicht personalisierte Ansichten.

Die `profiles`-Tabelle erweitert die Supabase Auth-Tabelle um benutzerdefinierte Felder wie Nutzernamen.

Die `radolan_geometry`-Tabelle speichert die 1km×1km-Rasterzellen des RADOLAN-Grids als PostGIS-Polygone.

**Row Level Security (RLS)** policies schützen sensible Daten:

```sql
-- Nutzer können nur ihre eigenen Bewässerungen sehen
CREATE POLICY "Users can view own waterings"
  ON trees_watered FOR SELECT
  USING (auth.uid() = uuid);

-- Baumdaten sind öffentlich lesbar
CREATE POLICY "Trees are publicly readable"
  ON trees FOR SELECT
  USING (true);
```

**Supabase Edge Functions** ergänzen die automatisch generierten REST-APIs um benutzerdefinierte Geschäftslogik. Die `gdk_stats`-Funktion beispielsweise aggregiert stadtweite Statistiken wie Gesamtanzahl der Bewässerungen, häufigste Baumarten und Verteilung nach Bezirken.

### 2.4 Datenverarbeitungspipeline

Die Verarbeitung von Wetterdaten ist eine der technisch anspruchsvollsten Komponenten:

**RADOLAN-Datenerfassung:** Der Deutsche Wetterdienst (DWD) stellt stündlich aktualisierte Niederschlagsradardaten im binären RADOLAN-Format bereit. Diese Rasterdaten decken ganz Deutschland in einer Auflösung von 1km×1km ab. Der Harvester lädt die letzten 30 Tage herunter, was 720 einzelne Binärdateien entspricht.

**GDAL-Verarbeitung:** Die Bibliothek GDAL (Geospatial Data Abstraction Library) wird verwendet, um die Binärdaten zu lesen. GDAL ist ein Industriestandard für geospatiale Datenverarbeitung, aber notorisch schwierig zu installieren, da es native C++-Bibliotheken erfordert.

**Räumlicher Zuschnitt:** Mithilfe von GeoPandas werden die deutschlandweiten Daten auf die Berliner Stadtgrenzen zugeschnitten. Hierfür wird ein Shapefile verwendet, das die exakte Grenze Berlins definiert.

**Spatial Join:** Die 1km-Rasterzellen werden mit den Baumstandorten verknüpft. Jedem Baum wird die ID der Rasterzelle zugewiesen, in der er sich befindet.

**Aggregation:** Für jeden Baum werden die 720 stündlichen Niederschlagswerte aus der zugehörigen Rasterzelle extrahiert und als Array in der Datenbank gespeichert.

**Tileset-Generierung:** Die aktualisierten Baumdaten werden als GeoJSON exportiert (etwa 500 MB), mit Tippecanoe in das MBTiles-Format konvertiert (etwa 50 MB dank Kompression) und zu Mapbox hochgeladen.

Diese Pipeline läuft täglich automatisiert und benötigt 20-30 Minuten Ausführungszeit.

---

## 3. Algorithmus zur Wasserbedarfsberechnung

Das Herzstück der Anwendung ist der Algorithmus, der den Wasserbedarf jedes Baumes berechnet. Dieser kombiniert multiple Datenquellen zu einer visuell ansprechenden und wissenschaftlich fundierten Empfehlung.

### 3.1 Baumaltersklassifizierung

Bäume werden basierend auf ihrem Alter in vier Kategorien eingeteilt:

- **BABY (0-10 Jahre):** Junge Bäume mit flachem Wurzelwerk benötigen 100 Liter pro 30 Tage
- **JUNIOR (11-40 Jahre):** Heranwachsende Bäume mit mittlerem Wurzelwerk benötigen 200 Liter pro 30 Tage
- **SENIOR (40+ Jahre):** Ausgewachsene Bäume mit tiefem Wurzelwerk benötigen 300 Liter pro 30 Tage
- **UNKNOWN:** Bäume ohne Pflanzjahr-Information erhalten keine Bedarfsberechnung

Diese Klassifizierung basiert auf arboristischen Faustregeln und wurde in Zusammenarbeit mit Berliner Stadtgärtnern entwickelt.

### 3.2 Berechnungsschritte

Der Algorithmus folgt einer klaren Logik:

**Schritt 1 - Referenzmenge ermitteln:** Basierend auf der Altersklasse wird die Referenz-Wassermenge festgelegt (100, 200 oder 300 Liter).

**Schritt 2 - Niederschlag berechnen:** Die 720 stündlichen RADOLAN-Werte werden summiert und durch 10 geteilt (Umrechnung von mm×10 in Liter).

**Schritt 3 - Nutzerbewässerungen aggregieren:** Alle in den letzten 30 Tagen protokollierten Gießereignisse für den Baum werden summiert.

**Schritt 4 - Sonstige Wasserquellen schätzen:** Die Differenz zwischen Referenzmenge und den bekannten Quellen (Niederschlag + Nutzerbewässerung) wird als "sonstige Wasserquellen" (Grundwasser, bezirkliche Bewässerung) angenommen, sofern positiv.

**Schritt 5 - Prozentwerte berechnen:** Jede Wasserquelle wird als Prozentsatz der Referenzmenge berechnet.

**Schritt 6 - Gießempfehlung ermitteln:** Der Baum sollte gegossen werden, wenn die Gesamtwassermenge unter der Referenzmenge liegt UND die aktuelle Jahreszeit innerhalb der Vegetationsperiode (April-Oktober) liegt.

### 3.3 Visualisierung

Das Ergebnis wird als gestapelter Fortschrittskreis mit D3.js dargestellt:

```typescript
// Beispiel für einen BABY-Baum (100L Referenz)
Niederschlag:        60L → 60% → Dunkelblau
Nutzerbewässerung:   25L → 25% → Hellblau
Sonstige Quellen:    15L → 15% → Grün
Fehlend:              0L → 0%
Gesamt:             100L → 100% → Baum ausreichend versorgt
```

Die farbcodierte Darstellung ermöglicht Nutzern, den Zustand auf einen Blick zu erfassen. Die Implementierung verwendet D3-Arc-Generatoren und berücksichtigt responsive Design-Anforderungen.

---

## 4. Herausforderungen bei der Bereitstellung

Die Analyse hat acht kritische Herausforderungen identifiziert, die die Bereitstellung erheblich erschweren:

### 4.1 Multi-Repository-Koordination

Die Verwaltung von vier separaten Repositories erfordert:

- Synchronisation von Versionen zwischen abhängigen Repositories
- Koordination von Breaking Changes über Repository-Grenzen hinweg
- Komplexe CI/CD-Pipelines mit Cross-Repository-Abhängigkeiten
- Erschwerte Onboarding-Prozesse für neue Entwickler

Ein neuer Entwickler muss alle vier Repositories klonen, konfigurieren und verstehen, bevor er produktiv arbeiten kann. Dies erhöht die Einstiegshürde erheblich.

### 4.2 GDAL-Installation als kritischer Blocker

GDAL ist die bei weitem größte Hürde für neue Deployments. Die Installation erfordert:

**Auf macOS:**
```bash
brew install gdal                    # System-GDAL installieren
export GDAL_CONFIG=/opt/homebrew/bin/gdal-config
pip install gdal==3.8.4              # Python-Bindings mit exakter Versionübereinstimmung
```

**Häufige Fehler:**
- Versionsinkompatibilität zwischen System-GDAL und Python-Bindings
- Fehlende C++-Header-Dateien
- Falsch gesetzte Umgebungsvariablen

**Auf Ubuntu:**
```bash
sudo apt-get install gdal-bin libgdal-dev
pip install gdal==$(gdal-config --version)
```

**Auf Windows:**
- Erfordert OSGeo4W-Installer oder Conda
- Oft Kompilierungsfehler
- Viele Entwickler scheitern an diesem Schritt

Schätzungsweise 50% der Setup-Zeit entfällt auf GDAL-Troubleshooting. Dies blockiert insbesondere nicht-Experten und macht automatisierte Deployments nahezu unmöglich.

### 4.3 Manuelle Datenimport-Schritte

Der Import von Baumdaten kann nicht automatisiert werden und umfasst:

1. **Datenbeschaffung:** Kontaktaufnahme mit Stadtverwaltung (kann Wochen dauern)
2. **Datenanalyse:** Verstehen des bereitgestellten Formats (CSV, Shapefile, Excel)
3. **Transformation:** Schreiben eines benutzerdefinierten Transformationsskripts
4. **Schema-Mapping:** Zuordnung der Spalten zum erforderlichen Schema
5. **Datenqualität:** Behandlung fehlender Koordinaten, ungültiger Pflanzjahre, etc.
6. **Import:** Manuelle SQL-Ausführung
7. **Validierung:** Überprüfung der Datenintegrität

Dieser Prozess erfordert GIS-Expertise und ist fehleranfällig. Datenqualitätsprobleme werden oft erst Monate später entdeckt.

### 4.4 Übermäßige Umgebungsvariablen

Die Konfiguration erfordert über 35 Umgebungsvariablen über alle Repositories hinweg:

- Frontend: 20 Variablen (Mapbox, Supabase, Kartenkonfiguration)
- Backend: 8 Variablen (Datenbank, Auth)
- DWD-Harvester: 15 Variablen (Datenbank, Mapbox, Shapefile-Pfade)
- OSM-Harvester: 5 Variablen (Supabase Storage)

Diese Fragmentierung führt zu:
- Konfigurationsfehlern durch Copy-Paste
- Fehlende Validierung bis zur Laufzeit
- Schnell veraltete Dokumentation
- Schwierigkeiten bei der Fehlersuche

### 4.5 Lange Tileset-Generierungszeiten

Die Generierung von Mapbox-Vektorkacheln für 400.000 Bäume dauert 30+ Minuten:

- GeoJSON-Export: 5 Minuten
- Tippecanoe-Konvertierung: 20 Minuten
- Mapbox-Upload: 5 Minuten

Bei Fehlern muss der gesamte Prozess wiederholt werden. Dies verlangsamt die Entwicklungsiteration und bindet Rechenressourcen.

### 4.6 Pipedream-Abhängigkeit

Die Verwendung von Pipedream für CRON-Scheduling ist unnötig:

**Aktueller Ablauf:**
```
Pipedream CRON → Webhook → GitHub API → repository_dispatch → GitHub Action
```

**Alternative (kostenlos und einfacher):**
```yaml
# GitHub Actions native CRON
on:
  schedule:
    - cron: '0 1 * * *'  # Täglich um 1 Uhr
```

Pipedream kostet 10€/Monat und fügt einen zusätzlichen Fehlerursprung hinzu.

### 4.7 Fehlende Containerisierung

Nur Supabase läuft lokal in Docker. Frontend und Harvester erfordern native Setups:

```bash
# Supabase: Docker ✓
npx supabase start

# Frontend: Native Installation ✗
nvm use && npm ci && npm run dev

# Harvester: Native Installation ✗
python3 -m venv venv && pip install -r requirements.txt
```

Dies führt zu "Works on my machine"-Problemen und inkonsistenten Entwicklungsumgebungen.

### 4.8 Hardcodierte stadtspezifische Werte

Berlin-spezifische Werte sind im Code hartcodiert:

```typescript
// In gdk_stats/index.ts
const MOST_FREQUENT_TREE_SPECIES = ["Linde", "Ahorn", "Eiche"];
const TREE_COUNT = 418000;

// In dwd-harvester
const WEATHER_HARVEST_LAT = 52.520008;
const WEATHER_HARVEST_LNG = 13.404954;
```

Dies erfordert manuelle Code-Änderungen für jede Stadt und verhindert automatisierte Multi-City-Deployments.

---

## 5. Lösungsvorschläge und Optimierungen

Basierend auf der Analyse werden sieben konkrete Lösungsansätze vorgeschlagen:

### 5.1 Monorepo-Architektur

**Vorschlag:** Migration zu einer Monorepo-Struktur mit Nx oder Turborepo.

**Struktur:**
```
giessdenkiez/
├── apps/
│   ├── frontend/
│   ├── api/
│   └── admin/           # Neue Admin-UI für Datenverwaltung
├── packages/
│   ├── db/              # Gemeinsame DB-Schemas
│   ├── types/           # Geteilte TypeScript-Typen
│   └── utils/           # Gemeinsame Utilities
├── services/
│   ├── weather-harvester/
│   └── pump-harvester/
└── package.json         # Workspace-Root
```

**Vorteile:**
- Ein einziger Clone-Vorgang
- Gemeinsame Dependencies
- Repository-übergreifendes Refactoring
- Vereinheitlichte CI/CD
- Typsicherheit über Grenzen hinweg

**Aufwand:** 2-3 Wochen Migration

### 5.2 Vollständige Containerisierung

**Vorschlag:** Docker Compose für alle Services einschließlich Harvester.

**docker-compose.yml:**
```yaml
services:
  postgres:
    image: postgis/postgis:15-3.4
  frontend:
    build: ./apps/frontend
    ports: ["5173:5173"]
  weather-harvester:
    image: osgeo/gdal:ubuntu-small-3.8.4  # GDAL vorinstalliert!
    build: ./services/weather-harvester
```

**Vorteile:**
- GDAL vorinstalliert im Container
- Identische Dev/Prod-Umgebungen
- Ein-Befehl-Setup: `docker-compose up`
- Keine lokale Python/GDAL-Installation

**Aufwand:** 1-2 Wochen

### 5.3 Konfigurationsverwaltung

**Vorschlag:** Zentralisierte Stadt-Konfigurationen.

```typescript
// config/cities/berlin.ts
export const berlinConfig = {
  name: "Berlin",
  map: {
    center: { lat: 52.494590, lng: 13.388837 },
    bounds: [[13.0824, 52.3281], [13.7683, 52.6816]]
  },
  weather: {
    harvestLocation: { lat: 52.520008, lng: 13.404954 }
  },
  trees: {
    mostFrequentSpecies: ["Linde", "Ahorn", "Eiche"],
    approximateCount: 418000
  }
};
```

**Multi-City-Support:**
```bash
CITY=leipzig npm run build
CITY=hamburg npm run build
```

**Vorteile:**
- Keine Code-Änderungen für neue Städte
- Typsichere Konfiguration
- Einfaches Hinzufügen neuer Städte

**Aufwand:** 1 Woche

### 5.4 Admin-UI für Datenimport

**Vorschlag:** Web-Interface für Nicht-Techniker.

**Features:**
- Datei-Upload (CSV, Shapefile, GeoJSON)
- Interaktives Spalten-Mapping
- Echtzeit-Validierung
- Fortschrittsanzeige
- Rollback bei Fehlern

**Technologie:** React Admin oder Refine

**Vorteile:**
- Nicht-technische Nutzer können Daten importieren
- Automatisierte Validierung
- Reduzierte Fehlerquote

**Aufwand:** 2-3 Wochen

### 5.5 GitHub Actions CRON

**Vorschlag:** Ersetzen von Pipedream durch native GitHub Actions.

```yaml
name: Scheduled Harvesters
on:
  schedule:
    - cron: '0 1 * * *'  # Täglich
```

**Vorteile:**
- Kostenlos
- Keine externe Abhängigkeit
- Bessere Sichtbarkeit

**Aufwand:** 1-2 Stunden

### 5.6 Alternative Tech Stack (Langfristig)

**Vorschlag:** Komplette Neugestaltung mit modernem Serverless-Stack.

```
Frontend:      Next.js 15 (App Router)
Backend:       Vercel Serverless Functions
Database:      Neon (Serverless PostgreSQL)
Maps:          MapLibre GL (Open Source)
Vector Tiles:  PMTiles (statische Dateien)
Deployment:    Vercel (All-in-One)
```

**PMTiles-Ansatz:**
- Statische Tileset-Dateien statt Mapbox API
- Direktes Laden via CDN
- Keine Mapbox-Kosten (Einsparung: 50-500€/Monat)

**Vorteile:**
- Keine Mapbox-Kosten
- Kein Vendor Lock-in
- Einfacheres Deployment
- Schnellere Performance

**Nachteile:**
- Komplette Neuentwicklung erforderlich
- 3-4 Monate Aufwand

**Aufwand:** 3-4 Monate

### 5.7 Priorisierung der Verbesserungen

**Kurzfristig (1-4 Wochen):**
1. Pipedream durch GitHub Actions ersetzen (2h)
2. Docker Compose für lokale Entwicklung (1 Woche)
3. Zentrale Konfiguration (1 Woche)

**Mittelfristig (1-3 Monate):**
1. Monorepo-Migration (3 Wochen)
2. Admin-UI für Datenimport (3 Wochen)
3. Caching-Strategie (1 Woche)

**Langfristig (3-6 Monate):**
1. PMTiles-Migration (1 Monat)
2. Mobile Apps (3 Monate)
3. Predictive Analytics (2 Monate)

---

## 6. Fazit und Empfehlungen

Gieß den Kiez ist ein technisch beeindruckendes und gesellschaftlich wirkungsvolles Projekt, das Best Practices in Domänenmodellierung, Benutzererfahrung und Civic Technology demonstriert. Die Plattform hat nachweislich zur Stärkung des Umweltbewusstseins und zur aktiven Beteiligung an der Stadtgestaltung beigetragen.

### Stärken

Die **Frontend-Architektur** ist mit modernen Tools wie Vite, TypeScript Strict Mode und Zustand vorbildlich umgesetzt. Die **Wasserbedarfsberechnung** zeigt ausgefeiltes Domänenwissen. Die **URL-basierte State-Verwaltung** ermöglicht Deep Linking und Teilbarkeit. Die **Testabdeckung** mit Unit- und E2E-Tests ist umfassend.

### Schwächen

Die **Multi-Repository-Komplexität** erhöht die Einstiegshürde. Die **GDAL-Abhängigkeit** blockiert regelmäßig Deployments. **Manuelle Datenimports** verhindern Automatisierung. **Übermäßige Umgebungsvariablen** führen zu Konfigurationsfehlern. Der **Mapbox Vendor Lock-in** verursacht hohe laufende Kosten.

### Bewertung der Deployment-Komplexität

**Aktuell: 8/10 (Sehr hoch)**

Die Bereitstellung erfordert Expertise in React, TypeScript, Python, GeoPandas, PostgreSQL/PostGIS, Mapbox und Supabase. Die geschätzte Setup-Zeit für einen erfahrenen Entwickler beträgt 6-8 Stunden, für einen Junior-Entwickler 2-3 Tage.

**Mit empfohlenen Verbesserungen: 4/10 (Moderat)**

Durch Containerisierung und Konfigurationszentralisierung könnte die Komplexität auf ein moderates Niveau reduziert werden.

### Prioritäre Handlungsempfehlungen

1. **Sofort:** Pipedream durch GitHub Actions CRON ersetzen (Aufwand: 2 Stunden, Einsparung: 10€/Monat)

2. **Kurzfristig:** Docker Compose für lokale Entwicklung einführen (Aufwand: 1 Woche, eliminiert GDAL-Probleme)

3. **Mittelfristig:** Monorepo-Migration durchführen (Aufwand: 3 Wochen, vereinfacht Entwicklung erheblich)

4. **Langfristig:** PMTiles-Migration evaluieren (Aufwand: 3 Monate, potenzielle Kosteneinsparung: 500€+/Monat)

### Schlusswort

Das Projekt würde am meisten von **Containerisierung** und **Konfigurationszentralisierung** profitieren, um die erforderliche technische Expertise für Deployments zu reduzieren. Dies würde die Mission des Projekts, mehreren Städten beim Kampf gegen den Klimawandel durch Community-Engagement zu helfen, erheblich unterstützen.

Die vorliegende Analyse soll als Grundlage für strategische Entscheidungen zur Weiterentwicklung und Optimierung von Gieß den Kiez dienen. Mit den vorgeschlagenen Verbesserungen kann die Plattform ihre gesellschaftliche Wirkung vervielfachen und noch mehr Städte dabei unterstützen, ihre grüne Infrastruktur durch zivilgesellschaftliches Engagement zu schützen.

---

**Wortanzahl: 2.847 Wörter**

**Ende der Architekturanalyse**

Für weitere Informationen siehe:
- [Vollständige technische Analyse (Englisch)](../claude.md)
- [Dokumentationsindex](./INDEX.md)
- [Befehlsreferenz](./COMMANDS.md)
