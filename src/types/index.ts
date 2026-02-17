export interface ErrorSnapshot {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  timestamp: Date;
  cwd: string;
  id: string;
}

export interface GitContext {
  branch: string;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: Date;
  };
  modifiedFiles: string[];
  untrackedFiles: string[];
  hasUncommittedChanges: boolean;
}

export interface EnvContext {
  nodeVersion?: string;
  pythonVersion?: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'unknown';
  dependencies: Record<string, string>;
  envVars: Record<string, string>;
  platform: string;
  arch: string;
}

export interface StackTraceLine {
  file: string;
  line: number;
  column?: number;
  function?: string;
  context?: string;
}

export interface ParsedStackTrace {
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'unknown';
  lines: StackTraceLine[];
  errorMessage: string;
  errorType: string;
}

export interface FileSnippet {
  path: string;
  startLine: number;
  endLine: number;
  content: string;
}

export interface GhostPackage {
  snapshot: ErrorSnapshot;
  git: GitContext;
  environment: EnvContext;
  stackTrace: ParsedStackTrace;
  relevantFiles: FileSnippet[];
  metadata: {
    version: string;
    capturedAt: Date;
  };
}

export interface CodeDiff {
  file: string;
  oldContent: string;
  newContent: string;
  unified: string;
}

export interface FixResult {
  rootCause: string;
  explanation: string;
  affectedFiles: string[];
  suggestedFix: CodeDiff[];
  confidence: number;
  additionalTests?: string[];
  status?: 'completed' | 'failed';
  message?: string;
}

export interface KiloConfig {
  apiKey?: string;
  apiUrl: string;
  timeout: number;
  saveHistory: boolean;
  maxSnapshots: number;
}

export interface AgentStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
  startedAt: Date;
  completedAt?: Date;
}
