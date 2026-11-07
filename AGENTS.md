# AGENTS.md: Contributor and AI Agent Guidelines

> Project: Dungeons & Dynasties Save Game Editor  
> Repository: https://github.com/mhazm/strawberry-sweet-candy  
> Audience: AI Coding Agents and Human Developers

This document defines operational rules, technical architecture, reusable modules, and workflow standards for this repository. Read and follow these instructions before modifying code.

---

## 1. Tech Stack and Architecture

| Layer | Technology | Notes |
|---|---|---|
| Frontend Framework | React 19 (`react`, `react-dom`) | Functional components, hooks, React 19 compiler-ready. |
| Language | TypeScript 5.7+ | Strict type checking, absolute imports, no `any` without justification. |
| Build Tool and Bundler | Vite 6 (`@vitejs/plugin-react`) | HMR on port 1420. |
| Desktop Runtime | Tauri v2 (`@tauri-apps/api`, Rust 2024) | Standalone desktop application with native file system and dialog plugins. |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Dark fantasy theme palette (`#0a080d`, `#141018`, `#dfb15b`, `#f5cb71`). |
| Icons | Lucide React (`lucide-react`) | SVG icons across the app. |
| Utilities | `clsx`, `tailwind-merge` | Conditional class joining via `cn(...)` in `src/lib/utils.ts`. |
| Localization | Custom modular i18n engine | Context-based with fallback, 8 languages supported (`en`, `id`, `zh`, `de`, `ja`, `es`, `ru`, `fr`). |

### Dual-Runtime Support
The application runs in two environments:
1. Desktop Mode (Tauri Native): Uses native file picker dialogs, scans `%APPDATA%` directly for game saves, and preserves backups in a dedicated editor backup directory.
2. Web Mode (Browser Fallback): Runs in modern web browsers (`npm run dev`). Falls back to the HTML5 File API (drag-and-drop, file upload, and JSON blob download) when `isTauri()` is `false`.

---

## 2. Versioning and Release Protocol

The active development version is locked at `1.0.0` until a public release is cut via GitHub Actions.

### Release Policy
- Day-to-day dev commits: Do not increment the version number. Commit features and fixes under the current active version (`1.0.0`).
- Public Release Bumps: Version increments happen strictly when preparing a public release via GitHub Actions (by pushing a release tag such as `v1.1.0` or running a release workflow).
  - MAJOR (`X.0.0`): Incompatible architectural changes or breaking savegame schema migrations.
  - MINOR (`1.X.0`): New feature, new view, new language, or backward-compatible enhancement.
  - PATCH (`1.0.X`): Bug fixes, tooltip improvements, translation tweaks, styling adjustments.

### Version Synchronization Rule (When Releasing)
Whenever a release is prepared, update the version in all three files synchronously:

1. `package.json` -> `"version": "X.Y.Z"`
2. `src-tauri/tauri.conf.json` -> `"version": "X.Y.Z"`
3. `src-tauri/Cargo.toml` -> `version = "X.Y.Z"`

### GitHub Actions CI/CD and Auto-Updater
Releases are automated via GitHub Actions using the `tauri-apps/tauri-action` pipeline:
- Trigger: Triggered by pushing a version tag (e.g. `git tag v1.0.0 && git push origin v1.0.0`) or manually via `workflow_dispatch`.
- Artifacts: Windows NSIS setup installer (`.exe`), Windows MSI installer (`.msi`), portable zip, and update bundle (`latest.json` + `.tar.gz.sig`).
- Cryptographic Signing: Tauri signs bundles with `TAURI_SIGNING_PRIVATE_KEY` stored in GitHub Secrets.
- In-App Auto-Updater: Users receive automatic in-app prompts to download and install updates directly from GitHub Releases (`latest.json`).

### Daily Commit and Push Checklist
Every agent turn that modifies code must follow this sequence:
```bash
# 1. Verify type safety and build
npx tsc --noEmit

# 2. Check git status to ensure .gitignore is effective
git status

# 3. Stage specific files
git add <modified-files>

# 4. Commit using Conventional Commits format
git commit -m "<type>(<scope>): <imperative summary>" -m "<detailed description>"

# 5. Push to remote main
git push origin main
```

---

## 3. Rules and Constraints

### Save Files and Dedicated Backups
- Never write `.bak` or scratch files into the game directory (`%APPDATA%\io.itch.brettlittle.dungeons-and-dynasties\backups\`).
- Never strip or alter unknown fields in the save game JSON. Preserve fields like `tactics`, `seed`, and `version` during parsing and serialization (`src/lib/parser.ts`).
- Always write automatic timestamped backups to `%APPDATA%\dnd-saveeditor\editor-backups\` before saving changes.
- Provide both in-memory hot reload and clean JSON export in Web mode.

### UI Authenticity and Data Integrity
- Never hardcode visual screenshot artifacts into the UI. Elements like "The Mustering", "0g" gems, or "Greentide Year" were artifacts from screenshots and are not part of the savegame schema.
- Bind directly to parsed savegame state (`save.guild.gold`, `save.guild.renown`, `save.calendar.day`, `save.calendar.year`). If a metric does not exist in the save data, do not invent dummy text.

### Tauri Desktop and Process Locking
- Never run `npm run tauri:build` while `dndeditor.exe` is running. On Windows, running binaries are file-locked by the OS, causing compilation errors: `Access is denied. (os error 5)`.
- Terminate open `dndeditor.exe` instances using `Stop-Process -Name dndeditor -Force` before running release builds.

### Tooltips and Styling
- Never use native browser tooltips (`title="..."`). Native tooltips cannot be styled, conflict with the dark fantasy theme, and clip inside modals.
- Never rely on inline `overflow: hidden` containers for popup menus or tooltips.
- Always use the custom `Tooltip` component (`src/components/ui/Tooltip.tsx`). It uses React Portal (`document.body`), fixed positioning, and high z-index (`99999`) to prevent clipping.

### Localization and Hardcoding
- Never hardcode English or Indonesian text in React components. Do not write raw text inside buttons, headers, modals, or stat descriptions.
- Never write inline language conditionals like `locale === 'id' ? 'Simpan' : 'Save'`.
- Always extract translation keys into `src/locales/` and call `const { t } = useTranslation();` or `getTraitName(id)` / `getTraitDesc(id)`.

---

## 4. Reusable Modules and Shared Components

Check this catalog before creating new UI elements:

### 1. Tooltip (`src/components/ui/Tooltip.tsx`)
A viewport-aware floating tooltip rendered directly into `document.body` via `createPortal`:
```tsx
import { Tooltip } from '../ui/Tooltip';

<Tooltip content="Bonus precision and damage against massive foes." position="top">
  <button>Hover Me</button>
</Tooltip>
```

### 2. TraitBadge (`src/components/roster/TraitBadge.tsx`)
Standardized badge for all 84 character traits and quirks:
```tsx
import { TraitBadge } from './TraitBadge';

<TraitBadge 
  traitId="giant-killer" 
  onRemove={() => handleRemove('giant-killer')}
  removable={true}
/>
```
Translates trait names and descriptions using the active language, applies color coding (green for beneficial, red for flaw, yellow for neutral), and wraps itself in `<Tooltip>`.

### 3. StatSlider (`src/components/roster/StatSlider.tsx`)
Slider component for 30 combat attributes and 7 hidden attributes:
```tsx
import { StatSlider } from './StatSlider';

<StatSlider
  label={getAttrName('might', 'Might')}
  code="MGT"
  value={delver.might}
  min={1}
  max={20}
  onChange={(val) => handleStatChange('might', val)}
  isKeyAttribute={true}
  description={getAttrDesc('might')}
/>
```

### 4. RaceInfoTooltip (`src/components/roster/RaceInfoTooltip.tsx`)
Renders an info icon `(i)` with a localized tooltip displaying race lore, combat strengths, and stat bonuses:
```tsx
<RaceInfoTooltip raceName={hero.kin} />
```

### 5. Button and Badge (`src/components/ui/`)
- `Button.tsx`: Variants include `primary` (gold fantasy button), `secondary`, `danger`, `ghost`, and sizes `sm`, `md`, `lg`.
- `Badge.tsx`: Compact colored status badges for roles, tiers, and statuses.

### 6. Logic and Math Utilities (`src/lib/`)
- `wonderkid.ts`:
  - `generateWonderkid(delver, classKey)`: Rolls optimal attributes prioritizing class-specific key attributes, raises PA to 180-200, adds tier-1 positive traits.
  - `calculateRating(delver)`: Computes overall rating stars (1 to 5) and star ratings.
- `constants.ts`:
  - Central repository for `CLASS_KEY_ATTRIBUTES` (class attributes with star priorities), `RACE_BONUSES`, all 30 attribute keys, all 7 hidden attributes, and the 84-trait database.
- `tauri.ts`:
  - Unified file I/O layer with fallback between native Tauri commands and browser file download/upload.
  - `listGameBackups()`: Scans official backup directories.
  - `saveGameWithBackup()`: Duplicates original file into `%APPDATA%\dnd-saveeditor\editor-backups\` prior to writing changes.
- `updater.ts`:
  - Tauri v2 auto-updater integration with GitHub Releases. Provides `checkForUpdate()` and `installUpdate()`.
- `utils.ts`:
  - `formatGold(amount)`: Formats numbers into fantasy currency strings (`1,250,000g`).
  - `cn(...)`: Merges Tailwind classes cleanly with conflict resolution.

---

## 5. Localization Architecture

The localization system is split into two layers:
1. General UI Strings: Stored in `src/locales/`.
2. Trait Database Translations: Stored in `src/locales/traits/`.

Both layers implement automatic deep fallback to English (`en`). If a language is partially translated, missing keys fall back to English without throwing runtime errors.

### Supported Languages (8)
| Code | Language | Flag | File Path | Traits File Path |
|---|---|---|---|---|
| `en` | English (Master) | 🇺🇸 | `src/locales/en.ts` | `src/locales/traits/en.ts` |
| `id` | Indonesia | 🇮🇩 | `src/locales/id.ts` | `src/locales/traits/id.ts` |
| `zh` | Simplified Chinese | 🇨🇳 | `src/locales/zh.ts` | `src/locales/traits/zh.ts` |
| `de` | German | 🇩🇪 | `src/locales/de.ts` | `src/locales/traits/de.ts` |
| `ja` | Japanese | 🇯🇵 | `src/locales/ja.ts` | `src/locales/traits/ja.ts` |
| `es` | Spanish | 🇪🇸 | `src/locales/es.ts` | `src/locales/traits/es.ts` |
| `ru` | Russian | 🇷🇺 | `src/locales/ru.ts` | `src/locales/traits/ru.ts` |
| `fr` | French | 🇫🇷 | `src/locales/fr.ts` | `src/locales/traits/fr.ts` |

---

### Adding a New Language

Follow these steps to add a language (e.g. Portuguese `pt`):

#### Step 1: Update the LanguageCode Type
In `src/locales/types.ts`, add the ISO code:
```typescript
export type LanguageCode =
  | 'en'
  | 'id'
  | 'zh'
  | 'de'
  | 'ja'
  | 'es'
  | 'ru'
  | 'fr'
  | 'pt';
```

#### Step 2: Create the UI Translation File
Create `src/locales/pt.ts` implementing `TranslationSchema`:
```typescript
import { TranslationSchema } from './types';

export const pt: TranslationSchema = {
  appName: 'Dungeons & Dynasties Editor de Save',
  saveGame: 'Salvar Jogo',
  // translate all keys adhering to TranslationSchema
};
```

#### Step 3: Register in UI Locales Index
In `src/locales/index.ts`:
```typescript
import { pt } from './pt';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // existing languages
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export const dictionaries: Record<LanguageCode, TranslationSchema> = {
  // existing dictionaries
  pt,
};
```

#### Step 4: Create the Trait Translation File
Create `src/locales/traits/pt.ts`:
```typescript
import { TraitLocalization } from '../types';

export const ptTraits: Record<string, TraitLocalization> = {
  brave: {
    name: 'Corajoso',
    desc: 'Valor excepcional contra monstros aterrorizantes',
  },
  // translate traits
};
```

#### Step 5: Register in Trait Index
In `src/locales/traits/index.ts`:
```typescript
import { ptTraits } from './pt';

export const traitDictionaries: Record<LanguageCode, Record<string, TraitLocalization>> = {
  // existing trait dictionaries
  pt: ptTraits,
};
```

#### Step 6: Verify
Run `npx tsc --noEmit`. The TypeScript compiler validates that all keys exist. Test the language selector in the UI top bar.

---

## 6. Directory Structure

```text
dnd-saveeditor/
├── .github/                      # CI/CD release workflow
│   └── workflows/release.yml     # Tauri automated release & updater manifest
├── .gitignore                    # Git ignore file
├── AGENTS.md                     # Agent guidelines, architecture, and rules
├── README.md                     # Project documentation
├── index.html                    # Root HTML entry point
├── package.json                  # Node dependencies and scripts
├── tsconfig.json                 # TypeScript project configuration
├── vite.config.ts                # Vite config with React & Tailwind plugins
├── public/                       # Static public assets
│   ├── sample-save.json          # Demo save game bundled for web mode
│   └── shield.svg                # Project crest icon
├── src-tauri/                    # Rust Tauri v2 desktop core
│   ├── Cargo.toml                # Rust dependencies and version
│   ├── tauri.conf.json           # Tauri window, bundle, updater & version config
│   └── src/
│       ├── main.rs               # Desktop executable runner
│       └── lib.rs                # Tauri backend initialization & plugins
└── src/                          # Frontend React source code
    ├── App.tsx                   # Main state container and orchestrator
    ├── main.tsx                  # React entry point with I18nProvider
    ├── index.css                 # Tailwind CSS directives
    ├── components/
    │   ├── cheats/QuickCheats.tsx # Cheats and batch editor tools
    │   ├── fallen/GraveyardView.tsx # Memorial hall & resurrection
    │   ├── guild/GuildEditor.tsx # Treasury, renown, calendar & staff wages
    │   ├── layout/               # Sidebar, GameTopBar, Header, SettingsModal, UpdateModal
    │   ├── roster/               # HeroCard, HeroModal, RosterTableView, StatSlider, TraitBadge
    │   ├── stash/StashEditor.tsx # Equipment inventory & tier 5 upgrades
    │   └── ui/                   # Reusable Tooltip, Button, Badge
    ├── lib/                      # Constants, i18n hook, parser, tauri I/O, updater, wonderkid
    ├── locales/                  # 8 languages UI translation files & types
    │   └── traits/               # 8 languages trait dictionary translations
    └── types/
        └── savegame.ts           # TypeScript schema of D&D savegame files
```

---

## 7. Core Rules Summary
1. Increment version in `package.json`, `tauri.conf.json`, and `Cargo.toml` only when cutting a public release.
2. Check `src/components/ui/` and `src/components/roster/` before writing new UI components.
3. Keep backups in `%APPDATA%\dnd-saveeditor\editor-backups\`.
4. Use `useTranslation()` for all user-facing text.
5. Verify with `npx tsc --noEmit` before staging and committing.
