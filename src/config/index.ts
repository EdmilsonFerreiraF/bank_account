import dotenv from 'dotenv'

dotenv.config()

export const env = process.env.NODE_ENV as string; // 'dev' or 'test'

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT as string)
  },
  db: {
    host: process.env.DEV_DB_HOST,
  },
  jwt: {
    expiresIn: parseInt(process.env.DEV_JWT_EXPIRES_IN as string) ,
    key: process.env.DEV_JWT_KEY,
  },
  bcrypt: {
    cost: parseInt(process.env.DEV_BCRYPT_COST as string) 
  }
};

const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT as string)
  },
  db: {
    host: process.env.TEST_DB_HOST,
  },
  jwt: {
    expiresIn: parseInt(process.env.TEST_JWT_EXPIRES_IN as string),
    key: process.env.TEST_JWT_KEY,
  },
  bcrypt: {
    cost: parseInt(process.env.TEST_BCRYPT_COST as string)
  }
};

 const config: any = {
  dev,
  test
};

export default config[env]