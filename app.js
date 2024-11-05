import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

// Sync the database
sequelize.sync().then(() => {
    console.log('DB synced :)')
}).catch(err => {
    console.error('Error syncing database:', err);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));