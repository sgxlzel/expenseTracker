import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  BarChart2,
  Calendar,
  Plus,
  Download,
  Filter,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  ArrowUpDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import AddTransactionModal from "../components/Add";
import { incomeStyles, transactionItemStyles } from "../assets/dummyStyles";
import {
  colorClasses,
  INCOME_CATEGORY_ICONS,
  CATEGORY_ICONS_Inc,
} from "../assets/color";

const API_BASE = "http://localhost:4000/api";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Bonus",
  "Gift",
  "Other",
];

// Custom Tooltip matching the screenshot format
const CustomTooltip = ({ active, payload, label, currency = "$" }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value || 0;
    return (
      <div className="bg-white dark:bg-[#141530] px-3.5 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-[#252752] text-center">
        <p className="font-bold text-gray-800 dark:text-white text-sm">{label}</p>
        <p className="text-xs text-gray-600 mt-0.5">
          Income : {currency}{value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Income = () => {
  const {
    transactions = [],
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions,
    currency = "$",
  } = useOutletContext();

  const [timeView, setTimeView] = useState("monthly"); // "daily" | "weekly" | "monthly" | "yearly"
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: "", amount: "" });
  const [editError, setEditError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "income",
    category: "Salary",
  });

  // Filter only income transactions
  const allIncomeTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions]
  );

  // Dynamic calculations based on selected timeView
  const trendData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    const currentDayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
    const currentHour = now.getHours();

    if (timeView === "daily") {
      // 24 Hours of today
      const hoursMap = {};
      for (let h = 0; h < 24; h++) {
        hoursMap[h] = 0;
      }

      const todayTransactions = allIncomeTransactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() === currentDate
        );
      });

      todayTransactions.forEach((t) => {
        const d = new Date(t.date);
        const h = d.getHours();
        hoursMap[h] = (hoursMap[h] || 0) + (Number(t.amount) || 0);
      });

      const points = [];
      for (let h = 0; h < 24; h++) {
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? "PM" : "AM";
        points.push({
          key: `${hour12} ${ampm}`,
          label: `${h}:00 (${hour12} ${ampm})`,
          amount: Math.round(hoursMap[h]),
          isCurrent: h === currentHour,
        });
      }

      const total = todayTransactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
      );

      return {
        points,
        refKey: `${currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour} ${currentHour >= 12 ? "PM" : "AM"}`,
        total,
        count: todayTransactions.length,
        periodLabel: "Today",
        chartTitle: "Daily Income Trends",
        chartSubtitle: "(Today)",
      };
    }

    if (timeView === "weekly") {
      // 7 Days of current week (Sun -> Sat)
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - currentDayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

      const weekTransactions = allIncomeTransactions.filter((t) => {
        const d = new Date(t.date);
        return d >= startOfWeek && d <= endOfWeek;
      });

      weekTransactions.forEach((t) => {
        const d = new Date(t.date);
        const dayIdx = d.getDay();
        weekMap[dayIdx] = (weekMap[dayIdx] || 0) + (Number(t.amount) || 0);
      });

      const points = dayNames.map((name, idx) => ({
        key: name,
        label: name,
        amount: Math.round(weekMap[idx] || 0),
        isCurrent: idx === currentDayOfWeek,
      }));

      const total = weekTransactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
      );

      return {
        points,
        refKey: dayNames[currentDayOfWeek],
        total,
        count: weekTransactions.length,
        periodLabel: "This Week",
        chartTitle: "Weekly Income Trends",
        chartSubtitle: "(This Week)",
      };
    }

    if (timeView === "yearly") {
      // 12 Months of current year
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthMap = {};
      for (let m = 0; m < 12; m++) {
        monthMap[m] = 0;
      }

      const yearTransactions = allIncomeTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear;
      });

      yearTransactions.forEach((t) => {
        const d = new Date(t.date);
        const m = d.getMonth();
        monthMap[m] = (monthMap[m] || 0) + (Number(t.amount) || 0);
      });

      const points = monthNames.map((name, idx) => ({
        key: name,
        label: name,
        amount: Math.round(monthMap[idx] || 0),
        isCurrent: idx === currentMonth,
      }));

      const total = yearTransactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
      );

      return {
        points,
        refKey: monthNames[currentMonth],
        total,
        count: yearTransactions.length,
        periodLabel: "This Year",
        chartTitle: "Yearly Income Trends",
        chartSubtitle: "(This Year)",
      };
    }

    // Default: "monthly" -> days 1 to daysInMonth (matching screenshot)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysMap = {};
    for (let i = 1; i <= daysInMonth; i++) {
      daysMap[i] = 0;
    }

    const monthTransactions = allIncomeTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === currentYear && d.getMonth() === currentMonth
      );
    });

    monthTransactions.forEach((t) => {
      const d = new Date(t.date);
      const dayNum = d.getDate();
      daysMap[dayNum] = (daysMap[dayNum] || 0) + (Number(t.amount) || 0);
    });

    const points = [];
    for (let i = 1; i <= daysInMonth; i++) {
      points.push({
        key: String(i),
        label: String(i),
        amount: Math.round(daysMap[i] || 0),
        isCurrent: i === currentDate,
      });
    }

    const total = monthTransactions.reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );

    return {
      points,
      refKey: String(currentDate),
      total,
      count: monthTransactions.length,
      periodLabel: "This Month",
      chartTitle: "Daily Income Trends",
      chartSubtitle: "(This Month)",
    };
  }, [allIncomeTransactions, timeView]);

  // Compute clean Y-axis scale domain
  const yAxisMax = useMemo(() => {
    const maxVal = Math.max(
      ...trendData.points.map((d) => d.amount),
      0
    );
    if (maxVal === 0) return 16000;
    const step = maxVal > 50000 ? 10000 : maxVal > 20000 ? 5000 : 4000;
    return Math.max(Math.ceil((maxVal * 1.15) / step) * step, 16000);
  }, [trendData]);

  // Filter and sort for the records list below
  const filteredIncomes = useMemo(() => {
    let list = allIncomeTransactions;
    if (selectedCategory !== "all") {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          (t.description || "").toLowerCase().includes(q) ||
          (t.category || "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === "amount-asc") return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      return new Date(b.date) - new Date(a.date); // default "date-desc"
    });
  }, [allIncomeTransactions, selectedCategory, searchTerm, sortBy]);

  const displayedIncomes = showAll
    ? filteredIncomes
    : filteredIncomes.slice(0, 5);

  // Add Income
  const handleAdd = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const payload = {
        ...newTransaction,
        type: "income",
        amount: Number(newTransaction.amount),
        date: newTransaction.date
          ? new Date(newTransaction.date).toISOString()
          : new Date().toISOString(),
      };
      if (addTransaction) {
        await addTransaction(payload);
      } else {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        await axios.post(`${API_BASE}/income/add`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (refreshTransactions) refreshTransactions();
      }
      setShowModal(false);
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "income",
        category: "Salary",
      });
    } catch (err) {
      console.error("Failed to add income:", err);
    }
  };

  // Inline edit handlers
  const startEditing = (t) => {
    setEditingId(t.id);
    setEditForm({
      description: t.description || "",
      amount: t.amount || "",
    });
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ description: "", amount: "" });
    setEditError("");
  };

  const saveEditing = async (t) => {
    if (!editForm.description.trim()) {
      setEditError("Description is required");
      return;
    }
    const numAmount = Number(editForm.amount);
    if (!numAmount || numAmount <= 0) {
      setEditError("Valid amount is required");
      return;
    }

    try {
      const updated = {
        ...t,
        description: editForm.description,
        amount: numAmount,
        type: "income",
      };
      if (editTransaction) {
        await editTransaction(t.id, updated);
      } else {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        await axios.put(`${API_BASE}/income/update/${t.id}`, updated, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (refreshTransactions) refreshTransactions();
      }
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update income:", err);
      setEditError("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income record?"))
      return;
    try {
      if (deleteTransaction) {
        await deleteTransaction(id, "income");
      } else {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        await axios.delete(`${API_BASE}/income/delete/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (refreshTransactions) refreshTransactions();
      }
    } catch (err) {
      console.error("Failed to delete income:", err);
    }
  };

  // Download Excel
  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/income/downloadexcel`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel:", err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Header with Timeframe Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Income Overview
          </h1>
          <p className="text-gray-500 dark:text-slate-300 text-sm mt-1">
            Track and visualize your earnings across daily, weekly, monthly, and yearly views
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-white dark:bg-[#141530] p-1 rounded-xl border border-gray-200 dark:border-[#252752] shadow-sm">
            {[
              { id: "daily", label: "Daily" },
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "yearly", label: "Yearly" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeView(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeView === tab.id
                    ? "bg-emerald-600 text-white shadow-sm font-semibold"
                    : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1f224d]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportExcel}
            disabled={exportLoading}
            className="flex items-center gap-2 bg-white dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] hover:bg-gray-50 dark:hover:bg-[#202c47] text-gray-700 dark:text-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-sm text-xs font-medium"
          >
            <Download className="w-4 h-4 text-gray-500" />
            {exportLoading ? "Exporting..." : "Export"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-xl transition-all shadow hover:shadow-md font-medium text-xs md:text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      {/* 3 Top Summary Cards (Dynamic based on selected timeframe) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total for current view */}
        <div className="bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#252752] flex flex-col justify-between">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currency}{trendData.total.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-300 mt-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{trendData.periodLabel}</span>
          </div>
        </div>

        {/* Card 2: Transactions for current view */}
        <div className="bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#252752] flex flex-col justify-between">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currency}{trendData.total.toLocaleString()}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-300 mt-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{trendData.count} transactions</span>
          </div>
        </div>

        {/* Card 3: All records count */}
        <div className="bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#252752] flex flex-col justify-between">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {allIncomeTransactions.length}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-300 mt-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>All records</span>
          </div>
        </div>
      </div>

      {/* Dynamic Income Trends Bar Chart */}
      <div className="bg-white dark:bg-[#141530] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#252752]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {trendData.chartTitle}{" "}
              <span className="text-sm font-normal text-gray-400 dark:text-slate-300 ml-1">
                {trendData.chartSubtitle}
              </span>
            </h2>
          </div>

          <span className="text-xs text-gray-400 dark:text-slate-300">
            Hover to view detailed amount • Green line indicates current period
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trendData.points}
              margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f9fafb"
              />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={{ stroke: "#f3f4f6" }}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                interval={timeView === "daily" ? 1 : 0}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickFormatter={(v) => `${currency}${v.toLocaleString()}`}
              />
              <Tooltip
                content={<CustomTooltip currency={currency} />}
                cursor={{ fill: "#cbd5e1", opacity: 0.8, rx: 4, ry: 4 }}
              />
              {trendData.refKey && (
                <ReferenceLine
                  x={trendData.refKey}
                  stroke="#059669"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}
              <Bar
                dataKey="amount"
                fill="#6ee7b7"
                radius={[6, 6, 0, 0]}
                maxBarSize={timeView === "daily" ? 12 : timeView === "yearly" ? 28 : 16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Records List */}
      <div className={incomeStyles.listContainer}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className={incomeStyles.sectionTitle}>
            <DollarSign className="w-6 h-6 text-green-500" />
            Income Transactions
            <span className="text-sm font-normal text-gray-500 dark:text-slate-300">
              ({filteredIncomes.length} records)
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search description..."
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#181938] border border-gray-300 dark:border-[#2f3166] text-gray-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative w-full sm:w-44">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={incomeStyles.filterSelect}
              >
                <option value="all">All Categories</option>
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className={incomeStyles.filterIcon} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={incomeStyles.filterSelect}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
              <ArrowUpDown className={incomeStyles.filterIcon} />
            </div>

            <button
              onClick={handleExportExcel}
              disabled={exportLoading}
              className={incomeStyles.exportButton}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className={incomeStyles.transactionList}>
          {displayedIncomes.map((t) => {
            const isEditing = editingId === t.id;
            const Icon =
              INCOME_CATEGORY_ICONS[t.category] ||
              CATEGORY_ICONS_Inc[t.category] || (
                <DollarSign className="w-5 h-5 text-green-500" />
              );

            return (
              <div
                key={t.id}
                className={transactionItemStyles.container(
                  isEditing,
                  colorClasses.income
                )}
              >
                <div className={transactionItemStyles.mainContainer}>
                  <div
                    className={transactionItemStyles.iconContainer(
                      "p-2.5 rounded-xl",
                      colorClasses.income
                    )}
                  >
                    {Icon}
                  </div>

                  <div className={transactionItemStyles.contentContainer}>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Description"
                          className={transactionItemStyles.input(
                            Boolean(editError),
                            colorClasses.income
                          )}
                        />
                        {editError && (
                          <p className={transactionItemStyles.errorText}>
                            {editError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className={transactionItemStyles.description}>
                          {t.description || "Income"}
                        </p>
                        <p className={transactionItemStyles.details}>
                          {t.category} •{" "}
                          {new Date(t.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className={transactionItemStyles.actionsContainer}>
                  <div className={transactionItemStyles.amountContainer}>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        placeholder="Amount"
                        className={transactionItemStyles.amountInput(
                          false,
                          colorClasses.income
                        )}
                      />
                    ) : (
                      <span
                        className={transactionItemStyles.amountText(
                          "font-bold text-lg",
                          colorClasses.income
                        )}
                      >
                        +{currency}{Number(t.amount || 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className={transactionItemStyles.buttonsContainer}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEditing(t)}
                          className={transactionItemStyles.saveButton(
                            colorClasses.income
                          )}
                          title="Save"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className={transactionItemStyles.cancelButton}
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(t)}
                          className={transactionItemStyles.editButton(
                            colorClasses.income
                          )}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className={transactionItemStyles.deleteButton(
                            colorClasses.income
                          )}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredIncomes.length === 0 && (
            <div className={incomeStyles.emptyStateContainer}>
              <div className={incomeStyles.emptyStateIcon}>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <p className={incomeStyles.emptyStateText}>
                {searchTerm ? `No income records found matching "${searchTerm}"` : "No income found"}
              </p>
              <p className={incomeStyles.emptyStateSubtext}>
                {searchTerm
                  ? "Try searching for a different keyword or category."
                  : "Get started by recording your first income stream."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-semibold transition-colors mx-auto"
                >
                  Clear Search Filter
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className={incomeStyles.emptyStateButton}
                >
                  <Plus className="w-4 h-4" />
                  Add Income
                </button>
              )}
            </div>
          )}
        </div>

        {/* View All Button */}
        {filteredIncomes.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={incomeStyles.viewAllButton}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                View All ({filteredIncomes.length})
              </>
            )}
          </button>
        )}
      </div>

      {/* Add Income Modal */}
      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAdd}
        type="income"
        title="Add New Income"
        buttonText="Add Income"
        categories={INCOME_CATEGORIES}
        color="teal"
      />
    </div>
  );
};

export default Income;
