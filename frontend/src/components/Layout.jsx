import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { styles } from '../assets/dummyStyles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { AddTransactionModal } from './Add';

const API_BASE = "http://localhost:4000/api";

// the token lives in localStorage ("remember me") or sessionStorage
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeArrayFromResponse = (res) => {
  const body = res?.data;
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.incomes)) return body.incomes;
  if (Array.isArray(body.expenses)) return body.expenses;
  return [];
};

const Layout = ({ onlogout, user, onUserUpdate }) => {
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickTransaction, setQuickTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  });

  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem("app_currency") || "$"
  );

  const setCurrency = (newCurrency) => {
    localStorage.setItem("app_currency", newCurrency);
    setCurrencyState(newCurrency);
  };

  // fetch transactions from server side
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${API_BASE}/income/get`, { headers }),
        axios.get(`${API_BASE}/expense/get`, { headers }),
      ]);

      const incomes = safeArrayFromResponse(incomeRes).map((i) => ({
        ...i,
        type: "income",
      }));
      const expenses = safeArrayFromResponse(expenseRes).map((e) => ({
        ...e,
        type: "expense",
      }));

      const allTransactions = [...incomes, ...expenses]
        .map((t) => ({
          id: t._id || t.id || t.id_str || Math.random().toString(36).slice(2),
          description: t.description || t.title || t.note || "",
          amount: t.amount != null ? Number(t.amount) : Number(t.value) || 0,
          date: t.date || t.createdAt || new Date().toISOString(),
          category: t.category || t.type || "Other",
          type: t.type,
          raw: t,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "Failed to fetch transactions",
        err?.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const endpoint =
        transaction.type === "income" ? "income/add" : "expense/add";
      await axios.post(`${API_BASE}/${endpoint}`, transaction, {
        headers: getAuthHeaders(),
      });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to add transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };

  const editTransaction = async (id, transaction) => {
    try {
      const endpoint =
        transaction.type === "income" ? "income/update" : "expense/update";
      await axios.put(`${API_BASE}/${endpoint}/${id}`, transaction, {
        headers: getAuthHeaders(),
      });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to edit transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };

  const deleteTransaction = async (id, type) => {
    try {
      const endpoint = type === "income" ? "income/delete" : "expense/delete";
      await axios.delete(`${API_BASE}/${endpoint}/${id}`, {
        headers: getAuthHeaders(),
      });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to delete transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleQuickAddSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const payload = {
        ...quickTransaction,
        amount: Number(quickTransaction.amount),
        date: quickTransaction.date
          ? new Date(quickTransaction.date).toISOString()
          : new Date().toISOString(),
      };
      await addTransaction(payload);
      setShowQuickAddModal(false);
      setQuickTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });
    } catch (err) {
      console.error("Failed to add transaction via quick add:", err);
    }
  };

  // everything the pages read with useOutletContext()
  const outletContext = {
    transactions, // ALL transactions; each page filters by its own time view
    loading,
    lastUpdated,
    timeFrame,
    setTimeFrame,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    user,
    updateUserData: onUserUpdate,
    openQuickAdd: () => setShowQuickAddModal(true),
    currency,
    setCurrency,
  };

  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onlogout={onlogout} />
      <Sidebar
        user={user}
        iscollapsed={sidebarCollapsed}
        setiscollapsed={setSidebarCollapsed}
        onlogout={onlogout}
      />

      <main className={styles.layout.mainContainer(sidebarCollapsed)}>
        <Outlet context={outletContext} />
      </main>

      <BottomNav onQuickAdd={() => setShowQuickAddModal(true)} />

      <AddTransactionModal
        showModal={showQuickAddModal}
        setShowModal={setShowQuickAddModal}
        newTransaction={quickTransaction}
        setNewTransaction={setQuickTransaction}
        handleAddTransaction={handleQuickAddSubmit}
        type="both"
        title="Quick Add Transaction"
        buttonText="Add Transaction"
      />
    </div>
  );
};

export default Layout;