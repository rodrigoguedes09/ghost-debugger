import { GhostPackage, KiloConfig, FixResult } from '../types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class KiloClient {
  private apiKey: string;
  private apiUrl: string;
  private timeout: number;
  private model: string;

  constructor(config: KiloConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = config.apiKey;
    this.apiUrl = 'https://api.kilo.ai/api/gateway';
    this.timeout = config.timeout;
    this.model = 'anthropic/claude-sonnet-4.5';
  }

  async analyzeError(ghostPackage: GhostPackage): Promise<FixResult> {
    const prompt = this.buildAnalysisPrompt(ghostPackage);
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert debugging assistant. Analyze errors, identify root causes, and suggest fixes.
Your response MUST be valid JSON with this exact structure:
{
  "rootCause": "brief description",
  "explanation": "detailed explanation",
  "affectedFiles": ["file1.js", "file2.js"],
  "suggestedFix": [
    {
      "file": "path/to/file.js",
      "oldContent": "original code",
      "newContent": "fixed code",
      "unified": "unified diff format"
    }
  ],
  "confidence": 85,
  "additionalTests": ["test suggestion"]
}`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.chatCompletion({
      model: this.model,
      messages,
      max_tokens: 4000,
      temperature: 0.2,
    });

    return this.parseFixResult(response);
  }

  async spawnCloudAgent(ghostPackage: GhostPackage): Promise<string> {
    return `agent-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  async waitForResult(agentId: string, timeout: number): Promise<FixResult> {
    const { getLastSnapshot } = await import('../utils/storage');
    const snapshot = await getLastSnapshot();
    
    if (!snapshot) {
      throw new Error('No snapshot found');
    }

    return await this.analyzeError(snapshot.ghostPackage);
  }

  private buildAnalysisPrompt(ghostPackage: GhostPackage): string {
    const { snapshot, git, environment, stackTrace, relevantFiles } = ghostPackage;

    let prompt = `# Error Analysis Request\n\n`;
    
    prompt += `## Command That Failed\n\`\`\`\n${snapshot.command}\n\`\`\`\n\n`;
    prompt += `Exit Code: ${snapshot.exitCode}\n\n`;

    if (snapshot.stderr) {
      prompt += `## Error Output\n\`\`\`\n${snapshot.stderr}\n\`\`\`\n\n`;
    }

    if (stackTrace.lines.length > 0) {
      prompt += `## Stack Trace\n`;
      prompt += `Language: ${stackTrace.language}\n`;
      prompt += `Error Type: ${stackTrace.errorType}\n`;
      prompt += `Message: ${stackTrace.errorMessage}\n\n`;
      
      stackTrace.lines.slice(0, 5).forEach(line => {
        prompt += `- ${line.file}:${line.line}${line.function ? ` in ${line.function}` : ''}\n`;
      });
      prompt += `\n`;
    }

    if (relevantFiles.length > 0) {
      prompt += `## Relevant Code\n\n`;
      relevantFiles.slice(0, 3).forEach(file => {
        prompt += `### ${file.path} (lines ${file.startLine}-${file.endLine})\n`;
        prompt += `\`\`\`\n${file.content}\n\`\`\`\n\n`;
      });
    }

    if (git.branch) {
      prompt += `## Git Context\n`;
      prompt += `Branch: ${git.branch}\n`;
      prompt += `Last Commit: ${git.lastCommit.message}\n`;
      if (git.modifiedFiles.length > 0) {
        prompt += `Modified Files: ${git.modifiedFiles.join(', ')}\n`;
      }
      prompt += `\n`;
    }

    prompt += `## Environment\n`;
    if (environment.nodeVersion) {
      prompt += `Node: ${environment.nodeVersion}\n`;
    }
    if (environment.pythonVersion) {
      prompt += `Python: ${environment.pythonVersion}\n`;
    }
    prompt += `Platform: ${environment.platform}\n\n`;

    if (Object.keys(environment.dependencies).length > 0) {
      prompt += `## Dependencies\n`;
      const deps = Object.entries(environment.dependencies).slice(0, 10);
      deps.forEach(([name, version]) => {
        prompt += `- ${name}: ${version}\n`;
      });
      prompt += `\n`;
    }

    prompt += `## Task\n`;
    prompt += `Analyze this error and provide:\n`;
    prompt += `1. Root cause identification\n`;
    prompt += `2. Detailed explanation\n`;
    prompt += `3. Specific code fixes (with exact file paths)\n`;
    prompt += `4. Confidence level (0-100)\n\n`;
    prompt += `Return ONLY valid JSON matching the schema provided in the system message.`;

    return prompt;
  }

  private async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } })) as any;
      throw new Error(`Kilo API error: ${errorData.error?.message || response.statusText}`);
    }

    return (await response.json()) as ChatCompletionResponse;
  }

  private parseFixResult(response: ChatCompletionResponse): FixResult {
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      return {
        rootCause: result.rootCause || 'Unknown error',
        explanation: result.explanation || 'No explanation provided',
        affectedFiles: result.affectedFiles || [],
        suggestedFix: result.suggestedFix || [],
        confidence: result.confidence || 50,
        additionalTests: result.additionalTests,
        status: 'completed',
      };
    } catch (error) {
      return {
        rootCause: 'Error parsing AI response',
        explanation: content,
        affectedFiles: [],
        suggestedFix: [],
        confidence: 30,
        status: 'completed',
      };
    }
  }
}
