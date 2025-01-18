import type { Config } from './config.interface';
import { config } from 'dotenv';
import { NODE_ENV } from 'src/constants';

config();

export default (): Config => {
  return {
    app: {
      nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.PRODUCTION,
      port: +process.env.APP_PORT || 3000,
    },
    database: {
      type: process.env.DATABASE_TYPE || 'postgres',
      database:
        (process.env.DATABASE_NAME || 'example') +
        (process.env.NODE_ENV === 'test' ? '_test' : ''),
      host: process.env.DATABASE_HOST || 'localhost',
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      port: +process.env.DATABASE_PORT || 5432,
      synchronize: process.env.NODE_ENV === 'test' ? true : false,
      dropSchema: process.env.NODE_ENV === 'test' ? true : false,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET || 'secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshIn: process.env.JWT_REFRESH_IN || '30d',
      bcryptSaltOrRound: 10,
    },
  };
};

export * from './config.interface';
