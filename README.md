# 🛡️ Dungeons & Dynasties - Save Game Editor

A lightweight, modern, and dark-fantasy themed save editor for **Dungeons & Dynasties** (by Bretticus82). Built with **Tauri v2 + React 19 + TypeScript + Tailwind CSS**.

![D&D Save Editor](public/shield.svg)

---

## ✨ Features

### 🏰 1. Guild Overview & Treasury
- **Treasury Gold Editor**: Direct input and one-click boost buttons (`+10k`, `+100k`, `+1M`, or set to exact amount).
- **Realm Renown Editor**: Edit guild prestige and tournament stature.
- **Season Calendar**: Modify current day / calendar schedule.
- **Patron Confidence & Stipends**: Adjust patron favor up to 100%.
- **Game Mode Toggles**: Toggle **Ironman Mode**, **Power Fantasy Mode**, and **Dungeonborn Origin** on or off.
- **Guild Staff & Experts**: View and max out skills (up to 100) and set wages to 0 for envoys, physicians, trainers, and scryers.

### ⚔️ 2. Comprehensive Roster (Delvers) Management
- **Delver Search & Filter**: Instant search by name, kin, or class, and filter by roles (**Tank**, **DPS**, **Healer**).
- **Current Ability (CA) & Potential Ability (PA)**: Dynamic meter and sliders (1 - 200 scale) with tier rankings (*Novice*, *Established*, *Veteran*, *Elite*, *World Class*).
- **Physical & Mental Condition**: Real-time condition (0-100%) and morale (0-100%) gauges with quick heal actions.
- **Character Sheet Modal**:
  - **30 Combat Attributes (1 - 20 scale)**:
    - *Physical*: Strength, Agility, Stamina, Vitality, Speed, Reflexes
    - *Combat Skills*: Weapon Skill, Marksmanship, Power, Spellcraft, Armor Use, Parry, Evasion, Critical Strike
    - *Mental*: Composure, Bravery, Concentration, Discipline, Resolve, Aggression
    - *Tactical*: Decisions, Anticipation, Teamwork, Leadership, Positioning, Threat, Mitigation, Healing, Support, Crowd Control
  - **7 Hidden Attributes (FM-style 1 - 20 scale)**:
    - Consistency, Big Game, Pressure, Death Proneness, Loyalty, Adaptability, Ruthlessness
  - **Health & Injury Cure**: Clear stress and fatigue, and cure any injury with a single click.
  - **Traits & Perks**: Add custom traits or remove negative flaws.

### ⚡ 3. Quick Cheats / God Mode
- **Infinite Treasury**: Instantly set Gold to `999,999,999`.
- **Max Renown**: Set Renown to `1,000`.
- **Divine Restoration**: Fully restore 100% Condition & Morale and cure all injuries for every delver in your guild.
- **Awaken Potential**: Set all delvers' Potential Ability (PA) to `200`.
- **God-Tier Attributes**: Max all 30 combat attributes to `20` for all roster heroes.
- **Max Hidden Perks**: Maximize Consistency, Loyalty, and Big Game temperament to `20`.
- **Necromancy**: Revive all dead heroes from the Graveyard back into the active roster.

### 📦 4. Stash & Armoury
- View equipment, weapons, and armor stored in the guild hall.
- Inspect affix modifiers, rarities, tiers, and market values.
- One-click upgrade to Tier 5 with max quality multipliers.

### 💀 5. Graveyard (Memorial Hall)
- View adventurers who perished in the dungeons.
- One-click **Revive to Active Roster** button that cleanses mortal wounds and restores them to 100% health.

---

## 🚀 Running the Application

### Option A: Web Mode (Ultra Lightweight, Instant Hot-Reload)
Run in any modern browser without needing to compile Rust:
```bash
npm run dev
```
Open [http://localhost:1420](http://localhost:1420) in your browser.

### Option B: Desktop Mode (Tauri v2 Native App)
Run as a native desktop application with auto-detection of game backups:
```bash
npm run tauri:dev
```

### Option C: Build Standalone Executable (.exe)
```bash
npm run tauri:build
```
The compiled lightweight `.exe` (~5-10 MB) will be generated inside `src-tauri/target/release/`.

---

## 📁 Save Game File Location & Dedicated Editor Backups

### Game Save Location
On Microsoft Windows, *Dungeons & Dynasties* saves and backups are located at:
```text
%APPDATA%\io.itch.brettlittle.dungeons-and-dynasties\backups\
```
Example: `White Tiger 2026-11-07 05-00.json`

### 🛡️ Dedicated Editor Backup System
To keep your official game folder completely clean, the Save Editor **never** pollutes the game's folder with `.bak` files. Instead, every time you save, the previous unedited version is automatically duplicated with a timestamp into:
```text
%APPDATA%\dnd-saveeditor\editor-backups\
```
*(e.g., `White Tiger 2026-11-07 05-00_backup_1794029800.json`)*. If you ever need to revert an edit, your original save files are safely preserved there!

To restore an edited save in-game:
1. Export or save the `.json` file.
2. In *Dungeons & Dynasties*, go to **Settings → Load a Ledger (or Restore)**.
3. Select the edited `.json` file to load your modified guild!

