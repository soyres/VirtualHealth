import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; 

dotenv.config(); // Load .env variables

const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // User
    process.env.DB_PASS, // Password
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
    }
)

export default sequelize;