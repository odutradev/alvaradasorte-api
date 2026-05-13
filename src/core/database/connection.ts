import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  password: String(process.env.DB_PASSWORD ?? ''),
  username: String(process.env.DB_USER ?? 'postgres'),
  database: String(process.env.DB_NAME ?? 'uailab'),
  host: String(process.env.DB_HOST ?? 'localhost'),
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  logging: false
})
