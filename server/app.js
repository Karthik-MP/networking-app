import express from 'express';
import cors from 'cors';
// import userRoutes from './src/routes/userRoutes.js';
// import authenticate from './src/services/authentication.js'; // Make sure authentication.js is after admin initialization
import authRouter from './src/routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', authRouter);
// app.use('/api/users', authenticate, userRoutes);
const PORT = process.env.PORT || 3001; // Use environment variable or default to 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
