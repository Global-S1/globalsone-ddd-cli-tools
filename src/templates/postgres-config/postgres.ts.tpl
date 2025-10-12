// This is a template for the PostgreSQL connection configuration.
// You should adapt this file to your project's needs.

import { Pool } from 'pg';

export interface IDatabase {
  query(sql: string, params?: any[]): Promise<any>;
  execute(sql: string, params?: any[]): Promise<any>;
}

export class PostgresConnection implements IDatabase {
  private pool: Pool;

  constructor(config: any) {
    this.pool = new Pool(config);
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async execute(sql: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result;
    } finally {
      client.release();
    }
  }
}

// Example of how to create the connections
// You should replace this with your own configuration

// const postgresReadConfig = {
//   user: 'user',
//   host: 'localhost',
//   database: 'database',
//   password: 'password',
//   port: 5432,
// };

// const postgresWriteConfig = {
//   user: 'user',
//   host: 'localhost',
//   database: 'database',
//   password: 'password',
//   port: 5432,
// };

// export const postgresRead = new PostgresConnection(postgresReadConfig);
// export const postgresWrite = new PostgresConnection(postgresWriteConfig);
