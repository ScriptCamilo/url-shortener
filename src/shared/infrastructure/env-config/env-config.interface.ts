export type nodeEnvTypes = 'development' | 'production' | 'test';

export interface EnvConfig {
  getAppPort(): number;
  getNodeEnv(): nodeEnvTypes;
}
