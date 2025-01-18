import { NODE_ENV } from 'src/constants';

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
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
