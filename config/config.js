import { config } from "dotenv";
import { env } from "process";
config();

const {
  DB_CLOUD,
  BEARER_KEY,
  SALT_ROUNDS,
  TOKEN_SIGNATURE,
  PROJECT_FOLDER,
  ENV_MODE,
  api_key,
  api_secret,
  cloud_name,
  SENDER_EMAIL,
  EMAIL_PASS,
  logo,
  facebookLink,
  instegram,
  twitterLink,
} = env;

export {
  DB_CLOUD,
  BEARER_KEY,
  SALT_ROUNDS,
  TOKEN_SIGNATURE,
  PROJECT_FOLDER,
  ENV_MODE,
  api_key,
  api_secret,
  cloud_name,
  SENDER_EMAIL,
  EMAIL_PASS,
  logo,
  facebookLink,
  instegram,
  twitterLink,
};
