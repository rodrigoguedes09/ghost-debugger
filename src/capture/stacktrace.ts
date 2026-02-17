import { ParsedStackTrace, StackTraceLine } from '../types';

export function parseStackTrace(output: string): ParsedStackTrace {
  const result: ParsedStackTrace = {
    language: 'unknown',
    lines: [],
    errorMessage: '',
    errorType: '',
  };

  if (!output || output.trim() === '') {
    return result;
  }

  const lines = output.split('\n');
  
  if (output.includes('at ') && (output.includes('.js:') || output.includes('.ts:'))) {
    result.language = output.includes('.ts:') ? 'typescript' : 'javascript';
    parseNodeStackTrace(lines, result);
  } else if (output.includes('File "') && output.includes(', line ')) {
    result.language = 'python';
    parsePythonStackTrace(lines, result);
  }

  return result;
}

function parseNodeStackTrace(lines: string[], result: ParsedStackTrace): void {
  for (const line of lines) {
    if (line.includes('Error:')) {
      const parts = line.split(':');
      result.errorType = parts[0].trim();
      result.errorMessage = parts.slice(1).join(':').trim();
    }

    const atMatch = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (atMatch) {
      result.lines.push({
        function: atMatch[1],
        file: atMatch[2],
        line: parseInt(atMatch[3]),
        column: parseInt(atMatch[4]),
        context: line.trim(),
      });
      continue;
    }

    const simpleMatch = line.match(/at\s+(.+?):(\d+):(\d+)/);
    if (simpleMatch) {
      result.lines.push({
        file: simpleMatch[1],
        line: parseInt(simpleMatch[2]),
        column: parseInt(simpleMatch[3]),
        context: line.trim(),
      });
    }
  }
}

function parsePythonStackTrace(lines: string[], result: ParsedStackTrace): void {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('Error:') || line.includes('Exception:')) {
      const parts = line.split(':');
      result.errorType = parts[0].trim();
      result.errorMessage = parts.slice(1).join(':').trim();
    }

    const fileMatch = line.match(/File "(.+?)", line (\d+)/);
    if (fileMatch) {
      const nextLine = lines[i + 1];
      const functionMatch = nextLine?.match(/in (.+)/);
      
      result.lines.push({
        file: fileMatch[1],
        line: parseInt(fileMatch[2]),
        function: functionMatch ? functionMatch[1].trim() : undefined,
        context: line.trim(),
      });
    }
  }
}
