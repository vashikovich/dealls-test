export enum NODE_ENV {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

export enum OAUTH_GRANT_TYPE {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
}

export enum AUTH_STRATEGY {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh_token',
}

export const DEFAULT_SWIPE_QUOTA = 10;
export const DEFAULT_CANDIDATE_AMOUNT = 10;
