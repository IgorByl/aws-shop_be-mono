import { Pool, PoolConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_USERNAME, PG_DATABASE, PG_PASSWORD } = process.env;

const dbOptions: PoolConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

export const pool = new Pool(dbOptions);
