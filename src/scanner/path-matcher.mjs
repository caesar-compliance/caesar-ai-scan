/**
 * Converts a gitignore-style glob pattern into a robust RegExp.
 */
export function globToRegex(glob) {
  let pattern = glob.trim();
  
  if (pattern.startsWith('/')) {
    pattern = pattern.slice(1);
  } else if (!pattern.includes('/')) {
    pattern = '**/' + pattern;
  }

  const isDirectoryPattern = pattern.endsWith('/');
  if (isDirectoryPattern) {
    pattern = pattern.slice(0, -1);
  }

  let regexStr = '';
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          regexStr += '(?:[^/]+/)*';
          i += 3;
        } else {
          regexStr += '.*';
          i += 2;
        }
      } else {
        regexStr += '[^/]*';
        i += 1;
      }
    } else if (char === '?') {
      regexStr += '[^/]';
      i += 1;
    } else if ('\\^$.+|()[]{}/'.includes(char)) {
      regexStr += '\\' + char;
      i += 1;
    } else {
      regexStr += char;
      i += 1;
    }
  }

  if (isDirectoryPattern) {
    return new RegExp('^' + regexStr + '(?:/.*)?$');
  } else {
    return new RegExp('^' + regexStr + '$');
  }
}

/**
 * Checks if a path (or any of its ancestor directories) matches a compiled ignore pattern.
 */
export function isPathIgnored(relativePath, compiledPatterns) {
  const parts = relativePath.split('/');
  
  // Check every prefix path segment
  // E.g. for "src/ignored-folder/file.js":
  // 1. "src"
  // 2. "src/ignored-folder"
  // 3. "src/ignored-folder/file.js"
  for (let i = 1; i <= parts.length; i++) {
    const prefixPath = parts.slice(0, i).join('/');
    for (const pattern of compiledPatterns) {
      if (pattern.regex.test(prefixPath)) {
        return { matched: true, pattern: pattern.raw };
      }
    }
  }
  return { matched: false };
}
