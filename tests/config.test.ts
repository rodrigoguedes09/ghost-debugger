import { saveConfig, loadConfig } from '../src/utils/config';
import { KiloConfig } from '../src/types';

describe('Config Management', () => {
  it('should load default config when no config exists', async () => {
    const config = await loadConfig();

    expect(config).toHaveProperty('apiUrl');
    expect(config).toHaveProperty('timeout');
    expect(config).toHaveProperty('saveHistory');
    expect(config.timeout).toBe(30000);
  });

  it('should save and load config', async () => {
    const testConfig: Partial<KiloConfig> = {
      apiKey: 'test-api-key-123',
      timeout: 60000,
    };

    await saveConfig(testConfig);
    const loadedConfig = await loadConfig();

    expect(loadedConfig.apiKey).toBe('test-api-key-123');
    expect(loadedConfig.timeout).toBe(60000);
  });
});
