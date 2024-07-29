import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: process.env.PORT,
  token: process.env.TOKEN,
  SECRET_KEYSTRIPE: process.env. SECRET_KEYSTRIPE,
  WEB_APP_URL: process.env.WEB_APP_URL
};

