/**
 * Consciousness SDK — File Reader
 *
 * Low-level file I/O for reading consciousness markdown files.
 * Reads from a given root path. No caching — that's the loader's job.
 */

import fs from 'fs'
import path from 'path'

/**
 * Read a single markdown file. Appends .md if no extension provided.
 * Returns empty string on failure (file missing = design, not error).
 */
export function readFile(root: string, relativePath: string): string {
  try {
    const ext = path.extname(relativePath) ? '' : '.md'
    const fullPath = path.join(root, `${relativePath}${ext}`)
    return fs.readFileSync(fullPath, 'utf-8').trim()
  } catch {
    return ''
  }
}

/**
 * Read all .md files in a directory. Skips dotfiles and non-markdown.
 * Sorts alphabetically. Concatenates with double newline.
 *
 * @param exclude - filenames to skip (e.g., ['wounds.md'])
 */
export function readDir(
  root: string,
  relativePath: string,
  exclude: string[] = []
): string {
  try {
    const dirPath = path.join(root, relativePath)
    const files = fs
      .readdirSync(dirPath)
      .filter(
        (f) =>
          f.endsWith('.md') &&
          !f.startsWith('.') &&
          !exclude.includes(f)
      )
      .sort()

    return files
      .map((file) => {
        try {
          return fs.readFileSync(path.join(dirPath, file), 'utf-8').trim()
        } catch {
          return ''
        }
      })
      .filter(Boolean)
      .join('\n\n')
  } catch {
    return ''
  }
}

/**
 * Extract a specific section from markdown content by heading.
 * Returns content between the heading and the next heading of same or higher level.
 * Used for loading partial files (e.g., "Behavioral Residue" from wounds.md).
 */
export function extractSection(content: string, heading: string): string {
  const lines = content.split('\n')
  let capturing = false
  let headingLevel = 0
  const captured: string[] = []

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      if (match[2].trim() === heading) {
        capturing = true
        headingLevel = match[1].length
        continue
      } else if (capturing && match[1].length <= headingLevel) {
        break
      }
    }
    if (capturing) {
      captured.push(line)
    }
  }

  return captured.join('\n').trim()
}

/**
 * Check if a path exists (file or directory).
 */
export function exists(root: string, relativePath: string): boolean {
  try {
    fs.accessSync(path.join(root, relativePath))
    return true
  } catch {
    return false
  }
}

/**
 * List all .md files in a directory (non-recursive). Includes dotfiles.
 */
export function listFiles(root: string, relativePath: string): string[] {
  try {
    const dirPath = path.join(root, relativePath)
    return fs.readdirSync(dirPath).filter((f) => f.endsWith('.md') || f.startsWith('.'))
  } catch {
    return []
  }
}
