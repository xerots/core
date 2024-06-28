import jwt from 'jsonwebtoken';

export * from './logger';

export function jwtVerify(jwtToken: string, options: jwt.VerifyOptions = {}) {
  if (!getJWTSecret()) {
    throw new Error('JWT secret not set');
  }

  return jwt.verify(jwtToken, getJWTSecret(), {
    audience: getEnv('APP_DOMAIN'),
    issuer: getEnv('APP_DOMAIN'),
    ...options,
  });
}

export function jwtSign(payload: object, options: jwt.SignOptions = {}) {
  if (!getJWTSecret()) {
    throw new Error('JWT secret not set');
  }

  return jwt.sign(payload, getJWTSecret(), {
    audience: getEnv('APP_DOMAIN'),
    issuer: getEnv('APP_DOMAIN'),
    ...options,
  });
}

export function getEnv(key: string, defaultValue = '') {
  return process.env[key] ?? defaultValue;
}

export function getJWTSecret() {
  return getEnv('JWT_SECRET');
}

export function isLocal() {
  return getEnv('NODE_ENV') === 'local';
}

export function isDevelopment() {
  return getEnv('NODE_ENV') === 'dev' || getEnv('NODE_ENV') === 'development';
}

export function isStaging() {
  return getEnv('NODE_ENV') === 'staging';
}

export function isTest() {
  return getEnv('NODE_ENV') === 'test' || getEnv('NODE_ENV') === 'testing';
}

export function isProduction() {
  return getEnv('NODE_ENV') === 'prod' || getEnv('NODE_ENV') === 'production';
}

export function isDebugEnabled() {
  return getEnv('APP_DEBUG') === 'true';
}
