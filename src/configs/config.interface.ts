import { NODE_ENV } from 'src/constants';

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  basicAuth: BasicAuthConfig;
  authentication: AuthenticationConfig;
}

export interface AppConfig {
  nodeEnv: NODE_ENV;
  port: number;
}

export interface DatabaseConfig {
  type: string;
  database: string;
  host: string;
  username: string;
  password: string;
  port: number;
  synchronize: boolean;
  dropSchema: boolean;
}

export interface JWTConfig {
  accessSecret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface BasicAuthConfig {
  username: string;
  password: string;
}

export interface AuthenticationConfig {
  sendConfirmationEmail: boolean;
  confirmationUrl: string;
  confirmationIn: number;
  resetPasswordUrl: string;
  resetPasswordIn: number;
  passwordPattern?: string | RegExp;
  maximumAttempts?: number;
  unlockIn?: string;
  unlockStrategy?: string;
  unlockAccessUrl?: string;
}
