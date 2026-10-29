import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  PieChart as PieChartIcon,
  TrendingUp as ProfitIcon,
  ArrowDown,
  DollarSign,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
  X,
  Activity,
} from "lucide-react";
import GaugeCard from "../components/GaugeCard";
import {AddTransactionModal} from "../components/Add";
import {
  getTimeFrameRange,
  getPreviousTimeFrameRange,
  calculateData,
} from "../components/Helpers";
import {
  GAUGE_COLORS,
  COLORS,
  INCOME_CATEGORY_ICONS,
  EXPENSE_CATEGORY_ICONS,
} from "../assets/color";
import { dashboardStyles, chartStyles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000/api";

function toIsoWithClientTime(dateValue) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (typeof dateValue === "string" && dateValue.length === 10) {
    const now = new Date();
    const hhmmss = now.toTimeString().slice(0, 8);
    const combined = new Date(`${dateValue}T${hhmmss}`);
    return combined.toISOString();
  }

  try {
    return new Date(dateValue).toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

const CashFlowTooltip = ({ active, payload, label, currency = "$" }) => {
  if (active && payload && payload.length) {
    const inc = payload.find((p) => p.dataKey === "income")?.value || 0;
    const exp = payload.find((p) => p.dataKey === "expense")?.value || 0;
    const net = inc - exp;
    return (
      <div className="bg-white/95 dark:bg-[#141530]/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-gray-100 dark:border-[#252752] text-xs space-y-1.5 min-w-[170px]">
        <p className="font-bold text-gray-800 dark:text-slate-100 text-sm mb-1">{label}</p>
        <p className="text-emerald-600 flex justify-between gap-4 font-medium">
          <span>Income:</span>
          <span>+{currency}{inc.toLocaleString()}</span>
        </p>
        <p className="text-orange-600 flex justify-between gap-4 font-medium">
          <span>Expense:</span>
          <span>-{currency}{exp.toLocaleString()}</span>
        </p>
        <div className="pt-1.5 mt-1 border-t border-gray-100 font-semibold flex justify-between gap-4 text-xs">
          <span className="text-gray-600 dark:text-slate-400">Net Flow:</span>
          <span className={net >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {net >= 0 ? "+" : "-"}{currency}{Math.abs(net).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const {
    transactions: outletTransactions = [],
    timeFrame = "monthly",
    setTimeFrame = () => { },
    refreshTransactions,
    currency = "$",
  } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [gaugeData, setGaugeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overviewMeta, setOverviewMeta] = useState({});
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  });

  const timeFrameRange = useMemo(
    () => getTimeFrameRange(timeFrame),
    [timeFrame]
  );
  const prevTimeFrameRange = useMemo(
    () => getPreviousTimeFrameRange(timeFrame),
    [timeFrame]
  );

  const isDateInRange = (date, start, end) => {
    const transactionDate = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    transactionDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return transactionDate >= startDate && transactionDate <= endDate;
  };

  const filteredTransactions = useMemo(
    () =>
      (outletTransactions || []).filter((t) =>
        isDateInRange(t.date, timeFrameRange.start, timeFrameRange.end)
      ),
    [outletTransactions, timeFrameRange]
  );

  const prevFilteredTransactions = useMemo(
    () =>
      (outletTransactions || []).filter((t) =>
        isDateInRange(t.date, prevTimeFrameRange.start, prevTimeFrameRange.end)
      ),
    [outletTransactions, prevTimeFrameRange]
  );

  const currentTimeFrameData = useMemo(() => {
    const data = calculateData(filteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [filteredTransactions]);

  const prevTimeFrameData = useMemo(() => {
    const data = calculateData(prevFilteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [prevFilteredTransactions]);

  useEffect(() => {
    const maxValues = {
      income: Math.max(currentTimeFrameData.income, 5000),
      expenses: Math.max(currentTimeFrameData.expenses, 3000),
      savings: Math.max(Math.abs(currentTimeFrameData.savings), 2000),
    };

    setGaugeData([
      {
        name: "Income",
        value: currentTimeFrameData.income,
        max: maxValues.income,
      },
      {
        name: "Spent",
        value: currentTimeFrameData.expenses,
        max: maxValues.expenses,
      },
      {
        name: "Savings",
        value: currentTimeFrameData.savings,
        max: maxValues.savings,
      },
    ]);
  }, [currentTimeFrameData, timeFrame]);

  const displayIncome =
    timeFrame === "monthly" && typeof overviewMeta.monthlyIncome === "number"
      ? overviewMeta.monthlyIncome
      : currentTimeFrameData.income;

  const displayExpenses =
    timeFrame === "monthly" && typeof overviewMeta.monthlyExpense === "number"
      ? overviewMeta.monthlyExpense
      : currentTimeFrameData.expenses;

  const displaySavings =
    timeFrame === "monthly" && typeof overviewMeta.savings === "number"
      ? overviewMeta.savings
      : currentTimeFrameData.savings;

  const expenseChange = useMemo(() => {
    const prev = prevTimeFrameData.expenses;
    const curr = displayExpenses;
    if (!prev) {
      if (!curr) return 0;
      return 100;
    }
    return Math.round(((curr - prev) / prev) * 100);
  }, [prevTimeFrameData, displayExpenses]);

  const financialOverviewData = useMemo(() => {
    if (
      timeFrame === "monthly" &&
      overviewMeta.expenseDistribution &&
      Array.isArray(overviewMeta.expenseDistribution) &&
      overviewMeta.expenseDistribution.length > 0
    ) {
      return overviewMeta.expenseDistribution.map((d) => ({
        name: d.category,
        value: Math.round(Number(d.amount) || 0),
      }));
    }

    const categories = {};
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        categories[transaction.category] =
          (categories[transaction.category] || 0) + transaction.amount;
      }
    });

    return Object.keys(categories).map((category) => ({
      name: category,
      value: Math.round(categories[category]),
    }));
  }, [filteredTransactions, overviewMeta, timeFrame]);

  const serverRecent = overviewMeta.recentTransactions || [];
  const serverRecentIncome = serverRecent
    .filter((t) => t.type === "income")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const serverRecentExpense = serverRecent
    .filter((t) => t.type === "expense")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const incomeTransactions = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "income")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filteredTransactions]
  );

  const expenseTransactions = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "expense")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filteredTransactions]
  );

  const incomeListForDisplay =
    timeFrame === "monthly" && serverRecentIncome.length > 0
      ? serverRecentIncome
      : incomeTransactions;

  const expenseListForDisplay =
    timeFrame === "monthly" && serverRecentExpense.length > 0
      ? serverRecentExpense
      : expenseTransactions;

  const cashFlowTrendData = useMemo(() => {
    const now = new Date();
    if (timeFrame === "yearly") {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const currentYear = now.getFullYear();
      return months.map((m, idx) => {
        const inMonth = (outletTransactions || []).filter((t) => {
          const d = new Date(t.date);
          return d.getFullYear() === currentYear && d.getMonth() === idx;
        });
        const income = inMonth
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        const expense = inMonth
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        return { label: m, income, expense, net: income - expense };
      });
    }

    if (timeFrame === "monthly") {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const weeks = [
        { label: "W1 (1-7)", start: 1, end: 7 },
        { label: "W2 (8-14)", start: 8, end: 14 },
        { label: "W3 (15-21)", start: 15, end: 21 },
        { label: "W4 (22+)", start: 22, end: 31 },
      ];
      return weeks.map((w) => {
        const inWeek = (outletTransactions || []).filter((t) => {
          const d = new Date(t.date);
          return (
            d.getFullYear() === currentYear &&
            d.getMonth() === currentMonth &&
            d.getDate() >= w.start &&
            d.getDate() <= w.end
          );
        });
        const income = inWeek
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        const expense = inWeek
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        return { label: w.label, income, expense, net: income - expense };
      });
    }

    if (timeFrame === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const curr = new Date(now);
      const first = curr.getDate() - curr.getDay();
      return days.map((dName, idx) => {
        const targetDay = new Date(curr.setDate(first + idx));
        const inDay = (outletTransactions || []).filter((t) => {
          const d = new Date(t.date);
          return d.toDateString() === targetDay.toDateString();
        });
        const income = inDay
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        const expense = inDay
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + (Number(t.amount) || 0), 0);
        return { label: dName, income, expense, net: income - expense };
      });
    }

    // Default or "daily" -> last 5 days
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
      const inDay = (outletTransactions || []).filter(
        (t) => new Date(t.date).toDateString() === d.toDateString()
      );
      const income = inDay
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + (Number(t.amount) || 0), 0);
      const expense = inDay
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + (Number(t.amount) || 0), 0);
      days.push({ label: dayLabel, income, expense, net: income - expense });
    }
    return days;
  }, [outletTransactions, timeFrame]);

  const searchedIncome = useMemo(() => {
    if (!searchTerm.trim()) return incomeListForDisplay;
    const q = searchTerm.toLowerCase();
    return incomeListForDisplay.filter(
      (t) =>
        (t.description || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
    );
  }, [incomeListForDisplay, searchTerm]);

  const searchedExpense = useMemo(() => {
    if (!searchTerm.trim()) return expenseListForDisplay;
    const q = searchTerm.toLowerCase();
    return expenseListForDisplay.filter(
      (t) =>
        (t.description || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
    );
  }, [expenseListForDisplay, searchTerm]);

  const displayedIncome = showAllIncome
    ? searchedIncome
    : searchedIncome.slice(0, 3);

  const displayedExpense = showAllExpense
    ? searchedExpense
    : searchedExpense.slice(0, 3);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/dashboard`, { headers });

      if (res?.data?.success) {
        const data = res.data.data;
        const recent = (data.recentTransactions || []).map((item) => {
          const typeFromServer =
            item.type || (item.category ? "expense" : "income");
          const amountNum = Number(item.amount) || 0;

          const isoDate = item.date
            ? new Date(item.date).toISOString()
            : item.createdAt
              ? new Date(item.createdAt).toISOString()
              : new Date().toISOString();

          return {
            id: item._id || item.id || Date.now() + Math.random(),
            date: isoDate,
            description:
              item.description ||
              item.note ||
              item.title ||
              (typeFromServer === "income"
                ? item.source || "Income"
                : item.category || "Expense"),
            amount: amountNum,
            type: typeFromServer,
            category:
              item.category ||
              (typeFromServer === "income" ? "Salary" : "Other"),
            raw: item,
          };
        });

        setOverviewMeta((prev) => ({
          ...prev,
          monthlyIncome: Number(data.monthlyIncome || 0),
          monthlyExpense: Number(data.monthlyExpense || 0),
          savings:
            typeof data.savings !== "undefined"
              ? Number(data.savings)
              : Number(data.monthlyIncome || 0) -
              Number(data.monthlyExpense || 0),
          savingsRate:
            typeof data.savingsRate !== "undefined" ? data.savingsRate : null,
          spendByCategory: data.spendByCategory || {},
          expenseDistribution: data.expenseDistribution || [],
          recentTransactions: recent,
        }));

        if (timeFrame === "monthly") {
          const monthlyIncome = Number(data.monthlyIncome || 0);
          const monthlyExpense = Number(data.monthlyExpense || 0);
          const savings =
            typeof data.savings !== "undefined"
              ? Number(data.savings)
              : monthlyIncome - monthlyExpense;

          const maxValues = {
            income: Math.max(monthlyIncome, 5000),
            expenses: Math.max(monthlyExpense, 3000),
            savings: Math.max(Math.abs(savings), 2000),
          };

          setGaugeData([
            { name: "Income", value: monthlyIncome, max: maxValues.income },
            { name: "Spent", value: monthlyExpense, max: maxValues.expenses },
            { name: "Savings", value: savings, max: maxValues.savings },
          ]);
        }
      } else {
        console.warn("Dashboard endpoint returned success:false", res?.data);
      }
    } catch (err) {
      console.error(
        "Failed to fetch dashboard overview:",
        err?.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [timeFrame]);

  const handleAddTransaction = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint =
        newTransaction.type === "income" ? "income/add" : "expense/add";
      const payload = {
        ...newTransaction,
        amount: Number(newTransaction.amount),
        date: toIsoWithClientTime(newTransaction.date),
      };
      await axios.post(`${API_BASE}/${endpoint}`, payload, { headers });
      setShowModal(false);
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });
      if (refreshTransactions) refreshTransactions();
      fetchOverview();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action controls: Add button + Timeframe filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <button
          onClick={() => setShowModal(true)}
          className={dashboardStyles.addButton}
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>

        <div className={dashboardStyles.timeFrameContainer}>
          <div className={dashboardStyles.timeFrameWrapper}>
            {["daily", "weekly", "monthly", "yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={dashboardStyles.timeFrameButton(timeFrame === frame)}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gauge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {gaugeData.map((gauge) => (
          <GaugeCard
            key={gauge.name}
            gauge={gauge}
            colorInfo={GAUGE_COLORS[gauge.name] || {}}
            timeFrameLabel={timeFrameRange.label}
            highlightNegative={gauge.name === "Savings"}
            currency={currency}
          />
        ))}
      </div>

      {/* Analytics Grid: Expense Distribution + Cash Flow Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart Card */}
        <div className="bg-white dark:bg-[#141530] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#252752] relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-teal-500" />
              Expense Distribution
              <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                ({timeFrameRange.label})
              </span>
            </h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className={chartStyles.pieChart}>
                <Pie
                  data={financialOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${Math.round(percent * 100)}%`
                  }
                  labelLine={false}
                >
                  {financialOverviewData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${currency}${Math.round(value).toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={dashboardStyles.tooltipContent}
                  itemStyle={dashboardStyles.tooltipItem}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(v) => (
                    <span className={dashboardStyles.legendText}>{v}</span>
                  )}
                  iconSize={10}
                  iconType="circle"
                  wrapperStyle={dashboardStyles.legendWrapper}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Trend Area Chart Card */}
        <div className="bg-white dark:bg-[#141530] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#252752] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Cash Flow Trend
              <span className="text-xs font-normal text-gray-500">
                (Income vs. Expense)
              </span>
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Income
              </span>
              <span className="flex items-center gap-1.5 text-gray-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                Expense
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cashFlowTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    `${currency}${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
                  }
                />
                <Tooltip content={<CashFlowTooltip currency={currency} />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeFlow)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseFlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search Bar for Recent Transactions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-[#141530] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#252752]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search recent transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#181938] border border-gray-200 dark:border-[#2f3166] text-gray-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 self-start sm:self-auto">
          Recent records for <span className="font-semibold text-gray-700">{timeFrameRange.label}</span>
        </p>
      </div>

      <div className={dashboardStyles.listsGrid}>
        {/* Income Column */}
        <div className={dashboardStyles.listContainer}>
          <div className={dashboardStyles.listHeader}>
            <h3 className={dashboardStyles.listTitle}>
              <ProfitIcon className="w-6 h-6 text-green-500" /> Recent Income{" "}
              <span className={dashboardStyles.listSubtitle}>
                {" "}
                ({timeFrameRange.label})
              </span>
            </h3>
            <span className={dashboardStyles.incomeCountBadge}>
              {incomeListForDisplay.length} records
            </span>
          </div>

          <div className={dashboardStyles.transactionList}>
            {displayedIncome.map((transaction) => {
              const IconComponent =
                INCOME_CATEGORY_ICONS[transaction.category] ||
                INCOME_CATEGORY_ICONS.Other;
              return (
                <div
                  key={transaction.id}
                  className={dashboardStyles.incomeTransactionItem}
                >
                  <div className={dashboardStyles.transactionContent}>
                    <div className={dashboardStyles.incomeIconContainer}>
                      {IconComponent}
                    </div>
                    <div>
                      <p className={dashboardStyles.transactionDescription}>
                        {transaction.description}
                      </p>
                      <p className={dashboardStyles.transactionCategory}>
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className={dashboardStyles.transactionAmount}>
                    <p className={dashboardStyles.incomeAmount}>
                      +{currency}{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className={dashboardStyles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {incomeListForDisplay.length === 0 && (
              <div className={dashboardStyles.emptyState}>
                <div
                  className={dashboardStyles.emptyIconContainer("bg-green-50")}
                >
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className={dashboardStyles.emptyText}>
                  No income transactions
                </p>
              </div>
            )}

            {incomeListForDisplay.length > 3 && (
              <div className={dashboardStyles.viewAllContainer}>
                <button
                  onClick={() => setShowAllIncome(!showAllIncome)}
                  className={dashboardStyles.viewAllButton}
                >
                  {showAllIncome ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      View All Income ({incomeListForDisplay.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expense Column */}
        <div className={dashboardStyles.listContainer}>
          <div className={dashboardStyles.listHeader}>
            <h3 className="text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-gray-800 dark:text-white md:mt-3 mt-3 flex items-center gap-3">
              <ArrowDown className="w-6 h-6 text-orange-500" /> Recent Expenses{" "}
              <span className={dashboardStyles.listSubtitle}>
                {" "}
                ({timeFrameRange.label})
              </span>
            </h3>
            <span className={dashboardStyles.expenseCountBadge}>
              {expenseListForDisplay.length} records
            </span>
          </div>

          <div className={dashboardStyles.transactionList}>
            {displayedExpense.map((transaction) => {
              const IconComponent =
                EXPENSE_CATEGORY_ICONS[transaction.category] ||
                EXPENSE_CATEGORY_ICONS.Other;
              return (
                <div
                  key={transaction.id}
                  className={dashboardStyles.expenseTransactionItem}
                >
                  <div className={dashboardStyles.transactionContent}>
                    <div className={dashboardStyles.expenseIconContainer}>
                      {IconComponent}
                    </div>
                    <div>
                      <p className={dashboardStyles.transactionDescription}>
                        {transaction.description}
                      </p>
                      <p className={dashboardStyles.transactionCategory}>
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className={dashboardStyles.transactionAmount}>
                    <p className={dashboardStyles.expenseAmount}>
                      -{currency}{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className={dashboardStyles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {expenseListForDisplay.length === 0 && (
              <div className={dashboardStyles.emptyState}>
                <div
                  className={dashboardStyles.emptyIconContainer("bg-orange-50")}
                >
                  <ShoppingCart className="w-8 h-8 text-orange-400" />
                </div>
                <p className={dashboardStyles.emptyText}>
                  No expense transactions
                </p>
              </div>
            )}

            {expenseListForDisplay.length > 3 && (
              <div className={dashboardStyles.viewAllContainer}>
                <button
                  onClick={() => setShowAllExpense(!showAllExpense)}
                  className={dashboardStyles.viewAllButton}
                >
                  {showAllExpense ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      View All Expenses ({expenseListForDisplay.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        type="both"
        title="Add New Transaction"
        buttonText="Add Transaction"
        color="teal"
      />
    </div>
  );
};

export default Dashboard;