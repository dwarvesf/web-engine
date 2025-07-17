import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function getEnvVariable(key: string, strict = true): string {
  const value = process.env[key];
  if (!value && strict) {
    throw new Error(`Environment variable [${key}] is not set`);
  }
  return value as string; // Assert that value is string if strict is true and no error was thrown
}

export const config = {
  SENDGRID_API_KEY: getEnvVariable('SENDGRID_API_KEY'),
  FORTRESS_API: getEnvVariable('FORTRESS_API_URL'),
};
