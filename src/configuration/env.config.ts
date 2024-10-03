export const EnvConfig = (): any => ({
  enviroment: process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3001,
  database_url: process.env.DATABASE_URL,
  secret_key_jwt: process.env.SECRET_KEY_JWT,
});
