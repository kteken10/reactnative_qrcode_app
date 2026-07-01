/* eslint-env node */
const packageJSON = require('./package.json');
const path = require('path');

const APP_ENV = process.env.APP_ENV ?? 'development';

// Load the correct .env file based on APP_ENV
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${APP_ENV}`),
});

// App identity constants — update these for your project
const BUNDLE_ID = 'com.qrcodegenerator';
const PACKAGE = 'com.qrcodegenerator';
const NAME = 'QR Code Generator';
const EXPO_ACCOUNT_OWNER = 'tekennnnnn';
const EAS_PROJECT_ID = '37599e7f-5066-48d4-8799-9f73095709d4';
const SCHEME = 'qrcodegenerator';

const withEnvSuffix = (name) =>
  APP_ENV === 'production' ? name : `${name}.${APP_ENV}`;

const Env = {
  APP_ENV,
  NAME,
  SCHEME,
  BUNDLE_ID: withEnvSuffix(BUNDLE_ID),
  PACKAGE: withEnvSuffix(PACKAGE),
  VERSION: packageJSON.version,
  EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID,
  API_URL: process.env.API_URL ?? '',
};

// Variables exposed to the app at runtime (via app.config.ts extra field)
const ClientEnv = {
  APP_ENV: Env.APP_ENV,
  NAME: Env.NAME,
  SCHEME: Env.SCHEME,
  BUNDLE_ID: Env.BUNDLE_ID,
  PACKAGE: Env.PACKAGE,
  VERSION: Env.VERSION,
  API_URL: Env.API_URL,
};

module.exports = { Env, ClientEnv, withEnvSuffix };
