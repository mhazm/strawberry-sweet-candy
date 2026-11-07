use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn get_backups_dir() -> Option<String> {
    let appdata = std::env::var("APPDATA").ok()?;
    let p = PathBuf::from(appdata)
        .join("io.itch.brettlittle.dungeons-and-dynasties")
        .join("backups");
    if p.exists() {
        Some(p.to_string_lossy().to_string())
    } else {
        None
    }
}

#[derive(serde::Serialize)]
struct BackupFileInfo {
    name: String,
    path: String,
    modified: u64,
    size: u64,
}

#[tauri::command]
fn list_game_backups() -> Result<Vec<BackupFileInfo>, String> {
    let appdata = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let dir = PathBuf::from(appdata)
        .join("io.itch.brettlittle.dungeons-and-dynasties")
        .join("backups");

    if !dir.exists() {
        return Ok(Vec::new());
    }

    let mut files = Vec::new();
    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            let meta = entry.metadata().ok();
            let modified = meta
                .as_ref()
                .and_then(|m| m.modified().ok())
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_secs())
                .unwrap_or(0);
            let size = meta.as_ref().map(|m| m.len()).unwrap_or(0);
            files.push(BackupFileInfo {
                name: entry.file_name().to_string_lossy().to_string(),
                path: path.to_string_lossy().to_string(),
                modified,
                size,
            });
        }
    }
    files.sort_by(|a, b| b.modified.cmp(&a.modified));
    Ok(files)
}

fn get_editor_backups_path() -> PathBuf {
    // Save editor backups in a dedicated folder in AppData or current directory
    if let Ok(appdata) = std::env::var("APPDATA") {
        let p = PathBuf::from(appdata)
            .join("dnd-saveeditor")
            .join("editor-backups");
        let _ = fs::create_dir_all(&p);
        p
    } else {
        let p = PathBuf::from("editor-backups");
        let _ = fs::create_dir_all(&p);
        p
    }
}

#[tauri::command]
fn read_save_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_save_file(path: String, content: String, make_backup: bool) -> Result<String, String> {
    let p = PathBuf::from(&path);
    let mut backup_info = String::new();

    if make_backup && p.exists() {
        let backup_dir = get_editor_backups_path();
        let file_stem = p.file_stem().and_then(|s| s.to_str()).unwrap_or("save");
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        let backup_file = backup_dir.join(format!("{}_backup_{}.json", file_stem, timestamp));

        let _ = fs::copy(&p, &backup_file);
        backup_info = backup_file.to_string_lossy().to_string();
    }

    fs::write(&p, content).map_err(|e| e.to_string())?;
    Ok(backup_info)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_backups_dir,
            list_game_backups,
            read_save_file,
            write_save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
