import url from "whatwg-url";

export const NODE_ENV = process.env.NODE_ENV || "production";
export const HOST = process.env.HOST || "0.0.0.0";
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6001;

export const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
export const GCS_CREDS_FILE = process.env.GCS_CREDS_FILE;

const REDIS_URL = process.env.REDIS_URL;

try {
  url.parseURL(REDIS_URL);
} catch {
  throw `Invalid REDIS_URL config`;
}

function redisConfig(urlString: string) {
  const params = url.parseURL(urlString);
  return {
    connection: {
      port: params.port,
      host: params.host,
      user: params.username,
      password: params.password,
    },
  };
}

export const REDIS_CONFIG = redisConfig(REDIS_URL!);
