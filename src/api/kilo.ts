import { GhostPackage, KiloConfig, AgentStatus, FixResult } from '../types';

export class KiloClient {
  private apiKey: string;
  private apiUrl: string;
  private timeout: number;

  constructor(config: KiloConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
    this.timeout = config.timeout;
  }

  async spawnCloudAgent(ghostPackage: GhostPackage): Promise<string> {
    // TODO: Replace with actual Kilo API call when we have the documentation
    // This is a placeholder implementation
    
    const response = await this.makeRequest('/agents/spawn', {
      method: 'POST',
      body: JSON.stringify({
        package: ghostPackage,
        type: 'ghost-debugger',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to spawn agent: ${response.statusText}`);
    }

    const data = await response.json() as { agentId?: string; id?: string };
    return data.agentId || data.id || '';
  }

  async getAgentStatus(agentId: string): Promise<AgentStatus> {
    const response = await this.makeRequest(`/agents/${agentId}/status`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get agent status: ${response.statusText}`);
    }

    return (await response.json()) as AgentStatus;
  }

  async getAgentResult(agentId: string): Promise<FixResult> {
    const response = await this.makeRequest(`/agents/${agentId}/result`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get agent result: ${response.statusText}`);
    }

    return (await response.json()) as FixResult;
  }

  async waitForResult(agentId: string, timeout: number): Promise<FixResult> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < timeout) {
      const status = await this.getAgentStatus(agentId);

      if (status.status === 'completed') {
        return await this.getAgentResult(agentId);
      }

      if (status.status === 'failed') {
        throw new Error(status.message || 'Agent failed');
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Agent timeout');
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit
  ): Promise<Response> {
    const url = `${this.apiUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}
