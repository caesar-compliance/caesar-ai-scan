# Caesar AI Ignore File: .caesarignore Reference

This document describes the syntax rules, glob patterns, and the zero-dependency regular expression translation engine in `caesar-ai-scan` version `0.5.0`.

---

## 📝 Syntax Rules

The `.caesarignore` file resides at the root of a scanned target repository. It follows standard gitignore conventions to identify files and directories that should be excluded from scans:

* **Comments:** Lines starting with `#` are ignored.
* **Whitespace:** Blank lines are ignored.
* **Root Lock:** A leading `/` binds matching to the target directory root (prevents deep recursive matching).
* **Directory Match:** A trailing `/` matches a directory and all files/directories nested inside it.
* **Wildcards:**
  * `*` matches any character-sequence except segment separators `/`.
  * `?` matches a single non-separator character.
  * `**` matches zero or more directory levels.

---

## 🧪 Glob-to-Regex Translation Examples

Our clean-room glob translator converts rules dynamically to standard JavaScript `RegExp` matching structures:

| Glob Rule | Target Regex | Matches | Bypasses |
| :--- | :--- | :--- | :--- |
| `ignored-ai-noise.js` | `/^.*\/ignored-ai-noise\.js$/` | `ignored-ai-noise.js`, `src/ignored-ai-noise.js` | `not-noise.js` |
| `/generated/` | `/^generated(?:/.*)?$/` | `generated/file.js`, `generated/sub/file.json` | `src/generated/file.js` |
| `**/*.log` | `/^(?:[^/]+/)*[^/]*\.log$/` | `app.log`, `logs/debug.log`, `src/tmp/err.log` | `log.txt` |
| `dist/` | `/^dist(?:/.*)?$/` | `dist/index.js`, `dist/vendor/main.js` | `src/dist/index.js` |

---

## 💡 Best Practices

1. **Keep it Local:** Place `.caesarignore` at the exact target project directory root to ensure robust relative path evaluations.
2. **Directory Slashes:** When ignoring directories, always use a trailing slash (e.g. `tmp/` rather than `tmp`), which enables progressive segment optimization to bypass walking those folders entirely.
3. **Specific File Exclusions:** Lock down high-risk sample/fixture files by exact path references (e.g. `/generated/ignored-ai-noise.js`).
