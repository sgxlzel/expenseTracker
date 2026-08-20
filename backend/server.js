import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
// import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import { connectDB } from './config/db.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoute.js'; // Import the expense routes
import dashboardRouter from './routes/dashboardRoutes.js'; // Import the dashboard routes

const app = express();
const port = 4000;

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))


//DB
connectDB();


//routes
app.use('/api/users', userRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter); // Add this line to include the expense routes
app.use('/api/dashboard', dashboardRouter); // Add this line to include the dashboard routes


app.get('/', (req, res) => {
  res.send('API is running...');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})