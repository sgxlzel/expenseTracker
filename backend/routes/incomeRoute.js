import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addIncome, getAllIncome, updateIncome, deleteIncome, getIncomeOverview, downloadIncomeExcel } from '../controllers/incomeController.js';

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get", authMiddleware, getAllIncome);
incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);  
incomeRouter.get("/downloadexcel", authMiddleware, downloadIncomeExcel); // Assuming you want to download all income data
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);       

export default incomeRouter;