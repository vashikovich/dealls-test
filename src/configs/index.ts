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
      type: 'postgres',
      database:
        process.env.NODE_ENV === 'test'
          ? `${process.env.DATABASE_NAME}_test`
          : process.env.DATABASE_NAME || 'example',
      host: process.env.DATABASE_HOST || 'localhost',
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      port: +process.env.DATABASE_PORT || 5432,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET || 'secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshIn: process.env.JWT_REFRESH_IN || '30d',
      bcryptSaltOrRound: 10,
    },
    authentication: {
      sendConfirmationEmail:
        Boolean(process.env.AUTH_SEND_CONFIRMATION_EMAIL) || false,
      confirmationUrl:
        process.env.AUTH_CONFIRMATION_URL || 'http://localhost:3000/confirm',
      confirmationIn: +process.env.AUTH_CONFIRMATION_IN || 24,
      resetPasswordUrl:
        process.env.AUTH_RESET_PASSWORD_URL ||
        'http://localhost:3000/reset-password',
      resetPasswordIn: +process.env.AUTH_RESET_PASSWORD_IN || 1,
      maximumAttempts: 10,
    },
    basicAuth: {
      username: process.env.BASIC_AUTH_USERNAME || 'admin',
      password: process.env.BASIC_AUTH_PASSWORD || 'admin',
    },
  };
};

export * from './config.interface';
