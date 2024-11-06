import express from 'express';
import cors from 'cors';
import logger from './config/logger.js';
import sequelize from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Middleware to parse JSON request bodies

// Register user routes
app.use('/api/users', userRoutes);

// Sync the database and log the status
sequelize.sync().then(() => {
    console.log('DB synced :)')
}).catch(err => {
    console.error('Error syncing database:', err);
})


// Ensure the app only starts the server if it's not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}


export default app;