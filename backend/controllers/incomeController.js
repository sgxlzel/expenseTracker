import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

//add income
export async function addIncome(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const newIncome = new incomeModel({
            description,
            amount,
            category,
            date: new Date(date),
            userId
        });

        await newIncome.save();

        //...lit change in code ifykyk
        return res.status(201).json({
            success: true,
            message: "Income added successfully"
        });
    } catch (error) {
        console.error("Error adding income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//to get income
export async function getAllIncome(req, res) {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
        res.json(incomes);
        // return res.status(200).json({
        //     success: true,
        //     data: incomes
        // });
    } catch (error) {
        console.error("Error fetching income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//update an income
export async function updateIncome(req, res) {
    const {id} = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;   
    
    try {
        const UpdatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId }, // Ensure the income belongs to the authenticated user
            { description, amount, date: new Date() }, // Update the date to the current date
            { new: true } // Return the updated document
        );
        if (!UpdatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        res.json({ success: true, message: "Income updated successfully", data: UpdatedIncome });


    } catch (error) {
        console.error("Error updating income:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}    

//to delete an income
export async function deleteIncome(req, res) {
    // const { id } = req.params;
    // const userId = req.user._id;
    try {
        const income = await incomeModel.findByIdAndDelete({ _id: req.params.id});
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        res.json({ 
            success: true, 
            message: "Income deleted successfully" 
        });
    }

    catch (error) {
        console.error("Error deleting income:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//to download income data in excel sheet
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = incomes.map(income => ({
            description: income.description,
            amount: income.amount,
            category: income.category,
            date: income.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "IncomeModel");
        XLSX.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");

    } catch (error) {
        console.error("Error downloading income data:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//to get income overview
export async function getIncomeOverview(req, res) {
    try{
        const userId = req.user._id;
        const {range = "monthly"} = req.query; // Default range
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        
        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 5);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }

    catch (error) {
        console.error("Error fetching income overview:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }

}