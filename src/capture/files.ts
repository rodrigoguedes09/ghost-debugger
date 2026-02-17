import { readFile } from 'fs/promises';
import { join } from 'path';
import { ParsedStackTrace, FileSnippet } from '../types';

export async function extractRelevantFiles(
  stackTrace: ParsedStackTrace,
  cwd: string
): Promise<FileSnippet[]> {
  const snippets: FileSnippet[] = [];
  const contextLines = 5;

  for (const traceLine of stackTrace.lines) {
    try {
      const filePath = join(cwd, traceLine.file);
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      const startLine = Math.max(0, traceLine.line - contextLines - 1);
      const endLine = Math.min(lines.length, traceLine.line + contextLines);

      const snippetContent = lines
        .slice(startLine, endLine)
        .join('\n');

      snippets.push({
        path: traceLine.file,
        startLine: startLine + 1,
        endLine: endLine,
        content: snippetContent,
      });
    } catch (error) {
      console.warn(`Warning: Could not read file ${traceLine.file}`);
    }
  }

  return snippets;
}
