import express from 'express';
import cors from 'cors';
// import userRoutes from './src/routes/userRoutes.js';
// import authenticate from './src/services/authentication.js'; // Make sure authentication.js is after admin initialization
import authRouter from './src/routes/authRoutes.js';

const app = express();

const corsOptions = {
  origin: '*',  // Front-end URL (adjust if you're using something else)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers (for your case, Content-Type is important)
  credentials: true, // Allow cookies or credentials if you're using them
};
app.use(cors(corsOptions));
app.use(express.json());

// Define routes
app.use('/api/auth', authRouter);
// app.use('/api/users', authenticate, userRoutes);
const PORT = process.env.PORT || 3001; // Use environment variable or default to 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
