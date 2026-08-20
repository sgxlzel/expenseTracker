import expenseModel from '../models/expenseModel.js';
import getDateRange from '../utils/dataFilter.js';
import XLSX from 'xlsx';



export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        } 
        const newExpense = new expenseModel({
                    description,
                    amount,
                    category,
                    date: new Date(date),
                    userId
                });
        
                await newExpense.save();
        
                //...lit change in code ifykyk
                return res.status(201).json({
                    success: true,
                    message: "Expense added successfully"
                });
    }
    catch (error) { 
        console.error("Error adding expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
//to all expenses
export async function getAllExpenses(req, res) {
    const userId = req.user._id;
    try {
            const expenses = await expenseModel.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
            res.json(expenses);
           
    } catch (error) {
            console.error("Error fetching expenses:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
        });
    }
    
}

// to update expense
export async function updateExpense(req, res) {
    const {id} = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;   
    
    try {
        const UpdatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId }, // Ensure the expense belongs to the authenticated user
            { description, amount, date: new Date() }, // Update the date to the current date
            { new: true } // Return the updated document
        );
        if (!UpdatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        res.json({ success: true, message: "Expense updated successfully", data: UpdatedExpense });


    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}    

//delete expense
export async function deleteExpense(req, res) {
     try {
        const userId = req.user._id;
        const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        res.json({ 
            success: true, 
            message: "Expense deleted successfully" 
        });
    }

    catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//download excel for expense
export async function downloadExpenseExcel(req, res) {
     const userId = req.user._id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        const plainData = expenses.map(expense => ({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseModel");
        XLSX.writeFile(workbook, "expense_details.xlsx");
        res.download("expense_details.xlsx");

    } catch (error) {
        console.error("Error downloading expense data:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//to get the expense overview
export async function getExpenseOverview(req, res) {
    try{
        const userId = req.user._id;
        const {range = "monthly"} = req.query; // Default range
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        
    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;

    const recentTransactions = expenses.slice(0, 5);


        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }

    catch (error) {
    console.error("Error fetching expense overview:", error);
    return res.status(500).json({
        success: false,
        message: "Server error"
    });
}


}