# 🤖 AGENTS.md — Contributor & AI Agent Guidelines

> **Project**: Dungeons & Dynasties Save Game Editor  
> **Repository**: [https://github.com/mhazm/strawberry-sweet-candy](https://github.com/mhazm/strawberry-sweet-candy)  
> **Primary Audience**: AI Coding Agents & Human Developers

This document defines the operational rules, technical architecture, reusable modules, and workflow standards for this repository. Every agent working on this codebase **must** read, understand, and strictly adhere to these instructions.

---

## 🛠️ 1. Tech Stack & Architecture

| Layer | Technology | Details / Notes |
|---|---|---|
| **Frontend Framework** | **React 19** (`react`, `react-dom`) | Modern functional components, hooks, React 19 compiler-ready. |
| **Language** | **TypeScript 5.7+** | Strict type-safety, absolute imports, no `any` without justification. |
| **Build Tool & Bundler**| **Vite 6** (`@vitejs/plugin-react`) | Ultra-fast HMR on port `1420`. |
| **Desktop Runtime** | **Tauri v2** (`@tauri-apps/api`, Rust 2024) | Standalone cross-platform desktop application; native file system & dialog plugins (`@tauri-apps/plugin-dialog`, `@tauri-apps/plugin-fs`). |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Dark fantasy theme palette (`#0a080d`, `#141018`, `#dfb15b`, `#f5cb71`). |
| **Icons** | **Lucide React** (`lucide-react`) | Standard SVG icons across the app. |
| **Class Utilities** | `clsx`, `tailwind-merge` | Unified conditional class joining (`cn(...)` in `src/lib/utils.ts`). |
| **Localization** | Custom modular i18n engine | Context-based with fallback, 8 languages supported (`en`, `id`, `zh`, `de`, `ja`, `es`, `ru`, `fr`). |

### Dual-Runtime Support
The application is architected to run seamlessly in two distinct environments:
1. **Desktop Mode (Tauri Native)**: Uses native file picker dialogs, scans `%APPDATA%` directly for game saves, and preserves backups in a dedicated editor backup directory.
2. **Web Mode (Browser Fallback)**: Runs in any modern web browser (`npm run dev`). Falls back to HTML5 File API (drag-and-drop, file upload, and JSON blob download) when `isTauri()` is `false`.

---

## 🏷️ 2. Semantic Versioning & Release Protocol (CRITICAL)

The active development version is locked at **`1.0.0`** until a public release is cut via GitHub Actions.

### Release & Versioning Policy
- **Day-to-day dev commits**: Do **NOT** increment the version number. Commit features and fixes under the current active version (`1.0.0`).
- **Public Release Bumps**: Version increments happen **STRICTLY** when preparing a public release via GitHub Actions (by pushing a release tag such as `v1.1.0` or running a release workflow).
  - **MAJOR (`X.0.0`)**: Incompatible architectural changes or breaking savegame schema migrations.
  - **MINOR (`1.X.0`)**: New feature, new view, new language, or backward-compatible enhancement.
  - **PATCH (`1.0.X`)**: Bug fixes, tooltip improvements, translation tweaks, styling adjustments.

### ⚠️ The Three-File Version Synchronization Rule (When Releasing)
Whenever a release is prepared, you **MUST** update the version in all three files synchronously:

1. [`package.json`](package.json) ➔ `"version": "X.Y.Z"`
2. [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json) ➔ `"version": "X.Y.Z"`
3. [`src-tauri/Cargo.toml`](src-tauri/Cargo.toml) ➔ `version = "X.Y.Z"`

### 🚀 GitHub Actions CI/CD & Auto-Updater Architecture
Releases are automated via GitHub Actions using the `tauri-apps/tauri-action` pipeline:
- **Workflow Trigger**: Triggered by pushing a version tag (e.g. `git tag v1.0.0 && git push origin v1.0.0`) or manually via `workflow_dispatch`.
- **Artifacts Generated**: Windows NSIS setup installer (`.exe`), Windows MSI installer (`.msi`), portable zip, and update bundle (`latest.json` + `.tar.gz.sig`).
- **Cryptographic Signing**: Tauri signs bundles with `TAURI_SIGNING_PRIVATE_KEY` configured in GitHub Secrets.
- **In-App Auto-Updater**: Users receive automatic in-app prompts to download and install updates directly from GitHub Releases (`latest.json`), eliminating manual downloads.

### Daily Commit & Push Checklist
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

## 🚫 3. "You CAN and You CANNOT" (Rules & Past Mistakes)

To prevent regression and repeat past mistakes, memorize the following constraints:

### 💾 Save Files & Dedicated Backups
- ❌ **CANNOT**: **Never pollute the game's actual directory** (`%APPDATA%\io.itch.brettlittle.dungeons-and-dynasties\backups\`) with `.bak`, scratch files, or test dumps.
- ❌ **CANNOT**: **Never strip or alter unknown fields** in the save game JSON. If the game has fields like `tactics`, `seed`, or `version`, preserve them untouched during parsing and serialization (`src/lib/parser.ts`).
- ✅ **CAN**: **Always use the dedicated editor backup directory** at `%APPDATA%\dnd-saveeditor\editor-backups\` to store automatic timestamps before saving changes.
- ✅ **CAN**: Provide both in-memory hot reload and clean JSON export in Web mode.

### 🎨 UI Authenticity & Data Integrity
- ❌ **CANNOT**: **Never hardcode visual screenshot artifacts** into the UI! In previous iterations, text like `"The Mustering"`, gems `"0g"`, or `"Greentide Year"` were hardcoded from screenshots. These are fictional/dynamic game states that might not exist in the savegame.
- ✅ **CAN**: **Always bind directly to parsed savegame state** (e.g. `save.guild.gold`, `save.guild.renown`, `save.calendar.day`, `save.calendar.year`). If a metric does not exist in the save data, do not invent dummy text.

### 🖥️ Tauri Desktop & Process Locking
- ❌ **CANNOT**: **Never run `npm run tauri:build` while `dndeditor.exe` is running**. On Windows, running binaries are file-locked by the OS, causing fatal compilation errors: `Access is denied. (os error 5)`.
- ✅ **CAN**: Always check running processes or terminate any zombie/open `dndeditor.exe` instances using `Stop-Process -Name dndeditor -Force` before running release builds.

### 💬 Tooltips & Styling
- ❌ **CANNOT**: **Never use native browser tooltips (`title="..."`)**. Native browser tooltips look primitive, cannot be styled, conflict with dark-fantasy themes, and cause clipping or flicker.
- ❌ **CANNOT**: **Never rely on inline `overflow: hidden` containers** for floating popup menus or tooltips.
- ✅ **CAN**: **Always use the custom [`Tooltip`](src/components/ui/Tooltip.tsx)** component. It uses React Portal (`document.body`), fixed positioning, and high z-index (`99999`) to prevent clipping.

### 🌐 Localization & Hardcoding
- ❌ **CANNOT**: **Never hardcode English or Indonesian text in React components**. Do not write raw text inside buttons, headers, modals, or stat descriptions.
- ❌ **CANNOT**: **Never write inline language conditionals** like `locale === 'id' ? 'Simpan' : 'Save'`.
- ✅ **CAN**: **Always extract translation keys** into `src/locales/` and call `const { t } = useTranslation();` or `getTraitName(id)` / `getTraitDesc(id)`.

---

## 🧩 4. Reusable Modules & Shared Components (DO NOT DUPLICATE)

Before creating any new UI elements, check this catalog of reusable components:

### 1. `Tooltip` (`src/components/ui/Tooltip.tsx`)
A viewport-aware, dark-fantasy floating tooltip rendered directly into `document.body` via `createPortal`:
```tsx
import { Tooltip } from '../ui/Tooltip';

<Tooltip content="Bonus precision and damage against massive foes." position="top">
  <button>Hover Me</button>
</Tooltip>
```
- **Features**: Auto-flips position if close to screen edge, high z-index (`99999`), rich border styling (`#3a2c42`), and custom delays.

### 2. `TraitBadge` (`src/components/roster/TraitBadge.tsx`)
Standardized badge for all 84 character traits and quirks:
```tsx
import { TraitBadge } from './TraitBadge';

<TraitBadge 
  traitId="giant-killer" 
  onRemove={() => handleRemove('giant-killer')} // optional
  removable={true}                              // optional
/>
```
- **Features**: Automatically translates trait names and descriptions using the active language, applies color coding (green for beneficial, red for negative flaw, yellow for neutral), and wraps itself in `<Tooltip>`.

### 3. `StatSlider` (`src/components/roster/StatSlider.tsx`)
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
  isKeyAttribute={true} // renders golden star badge for class core stats
  description={getAttrDesc('might')}
/>
```

### 4. `RaceInfoTooltip` (`src/components/roster/RaceInfoTooltip.tsx`)
Renders an info icon `(i)` with a localized tooltip displaying the chosen race's lore, combat strengths, and stat bonuses:
```tsx
<RaceInfoTooltip raceName={hero.kin} />
```

### 5. `Button` & `Badge` (`src/components/ui/`)
- [`Button.tsx`](src/components/ui/Button.tsx): Variants include `primary` (gold fantasy button), `secondary`, `danger`, `ghost`, and sizes `sm`, `md`, `lg`.
- [`Badge.tsx`](src/components/ui/Badge.tsx): Compact colored status badges for roles, tiers, and statuses.

### 6. Logic & Math Utilities (`src/lib/`)
- [`wonderkid.ts`](src/lib/wonderkid.ts):
  - `generateWonderkid(delver, classKey)`: Rolls optimal attributes prioritizing class-specific key attributes, raises PA to 180-200, adds tier-1 positive traits.
  - `calculateRating(delver)`: Computes overall rating stars (`1` to `5`) and star ratings.
- [`constants.ts`](src/lib/constants.ts):
  - Central repository for `CLASS_KEY_ATTRIBUTES` (which class needs which attributes with star priorities), `RACE_BONUSES`, all 30 attribute keys, all 7 hidden attributes, and the full 84-trait database.
- [`tauri.ts`](src/lib/tauri.ts):
  - Unified file I/O layer with automatic fallback between native Tauri commands and browser file download/upload.
  - `listGameBackups()`: Scans official backup directories.
  - `saveGameWithBackup()`: Safely duplicates original file into `%APPDATA%\dnd-saveeditor\editor-backups\` prior to writing changes.
- [`utils.ts`](src/lib/utils.ts):
  - `formatGold(amount)`: Formats numbers into fantasy currency strings (e.g. `1,250,000g`).
  - `cn(...)`: Merges Tailwind classes cleanly with conflict resolution.

---

## 🌍 5. Localization (i18n) Architecture & Adding New Languages

The localization system is modular, strongly typed, and split into two layers:
1. **General UI Strings**: Stored in [`src/locales/`](src/locales/).
2. **Trait Database Translations**: Stored in [`src/locales/traits/`](src/locales/traits/).

Both layers implement **automatic deep fallback to English (`en`)**. If a new language is partially translated, missing keys will never crash the app; they seamlessly fall back to English.

### Currently Supported Languages (8)
| Code | Language | Flag | File Path | Traits File Path |
|---|---|---|---|---|
| `en` | English (Master) | 🇺🇸 | `src/locales/en.ts` | `src/locales/traits/en.ts` |
| `id` | Indonesia | 🇮🇩 | `src/locales/id.ts` | `src/locales/traits/id.ts` |
| `zh` | 简体中文 (Simplified Chinese) | 🇨🇳 | `src/locales/zh.ts` | `src/locales/traits/zh.ts` |
| `de` | Deutsch (German) | 🇩🇪 | `src/locales/de.ts` | `src/locales/traits/de.ts` |
| `ja` | 日本語 (Japanese) | 🇯🇵 | `src/locales/ja.ts` | `src/locales/traits/ja.ts` |
| `es` | Español (Spanish) | 🇪🇸 | `src/locales/es.ts` | `src/locales/traits/es.ts` |
| `ru` | Русский (Russian) | 🇷🇺 | `src/locales/ru.ts` | `src/locales/traits/ru.ts` |
| `fr` | Français (French) | 🇫🇷 | `src/locales/fr.ts` | `src/locales/traits/fr.ts` |

---

### 📖 Step-by-Step: How to Add a 9th Language (e.g. Portuguese `pt`)

Follow these exact 5 steps to add any new language:

#### Step 1: Update the `LanguageCode` Type
Open [`src/locales/types.ts`](src/locales/types.ts) and add the ISO language code to the union:
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
  | 'pt'; // <-- Add new code here
```

#### Step 2: Create the UI Translation File
Create `src/locales/pt.ts` implementing `TranslationSchema`:
```typescript
import { TranslationSchema } from './types';

export const pt: TranslationSchema = {
  appName: 'Dungeons & Dynasties Editor de Save',
  saveGame: 'Salvar Jogo',
  // ... translate all keys adhering to TranslationSchema
};
```

#### Step 3: Register in UI Locales Index
Open [`src/locales/index.ts`](src/locales/index.ts):
```typescript
import { pt } from './pt';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // ... existing languages
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export const dictionaries: Record<LanguageCode, TranslationSchema> = {
  // ... existing dictionaries
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
  // ... translate traits
};
```

#### Step 5: Register in Trait Index
Open [`src/locales/traits/index.ts`](src/locales/traits/index.ts):
```typescript
import { ptTraits } from './pt';

export const traitDictionaries: Record<LanguageCode, Record<string, TraitLocalization>> = {
  // ... existing trait dictionaries
  pt: ptTraits,
};
```

#### Step 6: Verify
Run `npx tsc --noEmit`. The TypeScript compiler will instantly validate that all mandatory keys exist and that no typos were introduced. Once verified, test the language selector in the UI top bar.

---

## 📂 6. Directory Structure Quick Reference

```text
dnd-saveeditor/
├── .gitignore                    # Robust gitignore (node_modules, target, tsbuildinfo, test saves)
├── AGENTS.md                     # This file - Agent rules, reusable modules & i18n instructions
├── README.md                     # User-facing project documentation
├── index.html                    # Root HTML entry point
├── package.json                  # Node dependencies & app version
├── tsconfig.json                 # TypeScript project configuration
├── vite.config.ts                # Vite config with React & Tailwind plugins
├── public/                       # Static public assets
│   ├── sample-save.json          # Demo save game bundled for web mode
│   └── shield.svg                # Project crest icon
├── src-tauri/                    # Rust Tauri v2 desktop core
│   ├── Cargo.toml                # Rust dependencies & version
│   ├── tauri.conf.json           # Tauri window, bundle & version config
│   └── src/
│       ├── main.rs               # Desktop executable runner
│       └── lib.rs                # Tauri backend initialization & plugins
└── src/                          # Frontend React source code
    ├── App.tsx                   # Main state container & orchestrator
    ├── main.tsx                  # React entry point with I18nProvider
    ├── index.css                 # Tailwind CSS v4 directives & custom themes
    ├── components/
    │   ├── cheats/QuickCheats.tsx # God mode & batch editor tools
    │   ├── fallen/GraveyardView.tsx # Memorial hall & resurrection
    │   ├── guild/GuildEditor.tsx # Treasury, renown, calendar & staff wages
    │   ├── layout/               # Sidebar, GameTopBar, Header, SettingsModal
    │   ├── roster/               # HeroCard, HeroModal, RosterTableView, StatSlider, TraitBadge
    │   ├── stash/StashEditor.tsx # Equipment inventory & tier 5 upgrades
    │   └── ui/                   # Reusable Tooltip, Button, Badge
    ├── lib/                      # Constants, i18n hook, parser, tauri I/O, wonderkid algorithm
    ├── locales/                  # 8 languages UI translation files & types
    │   └── traits/               # 8 languages trait dictionary translations
    └── types/
        └── savegame.ts           # Complete TypeScript schema of D&D savegame files
```

---

## 🏁 Summary for Every Agent
1. **Always increment version** in `package.json`, `tauri.conf.json`, and `Cargo.toml`.
2. **Never duplicate components**: check `src/components/ui/` and `src/components/roster/` first.
3. **Never touch the user's game backups folder**: keep backups in `%APPDATA%\dnd-saveeditor\editor-backups\`.
4. **Never hardcode UI text**: use `useTranslation()`.
5. **Always type-check with `npx tsc --noEmit`** before staging and committing with Conventional Commits.

