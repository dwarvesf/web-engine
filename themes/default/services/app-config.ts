/**
 * Service for storing and managing environment configuration data.
 *
 * This class allows you to set, retrieve, and access specific values
 * from a configuration object, typically used for environment variables
 * or application settings.
 *
 * @typeParam T - The shape of the configuration object, defaults to Record<string, any>.
 */
export class AppConfigService<
  T extends Record<string, any> = Record<string, any>,
> {
  private config: T = {} as T;

  /**
   * Receives and stores configuration data.
   * @param data Configuration object to store.
   */
  setConfig(data: Partial<T>): void {
    this.config = { ...this.config, ...data };
  }

  /**
   * Retrieves the stored configuration data.
   * @returns The current configuration object.
   */
  getConfig(): T {
    return { ...this.config };
  }

  /**
   * Gets a specific configuration value by key.
   * @param key The key of the configuration value.
   * @returns The value associated with the key, or undefined.
   */
  getValue<K extends keyof T>(key: K): T[K] | undefined {
    return this.config[key];
  }
}

export type ConfigurationServiceName =
  | 'EMAILER_API'
  | 'HUBSPOT_API'
  | 'GOOGLE_API';

export const appConfigService = new AppConfigService<
  Record<ConfigurationServiceName, string>
>();
