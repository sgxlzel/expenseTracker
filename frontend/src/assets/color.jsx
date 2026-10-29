// constants/financeConstants.js
import { 
  Utensils, Home, Car, ShoppingCart, Gift, 
  TrendingUp, TrendingDown, DollarSign, 
  BarChart2, ArrowUp, FileText, 
  Briefcase, CreditCard, ShoppingBag, 
  Film, Wifi, Heart
} from "lucide-react";

export const GAUGE_COLORS = {
  Income: { 
    gradientStart: '#10b981',
    gradientEnd: '#059669',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60'
  },
  Spent: { 
    gradientStart: '#f97316',
    gradientEnd: '#ea580c',
    text: 'text-orange-600 dark:text-amber-400',
    bg: 'bg-orange-100 dark:bg-amber-950/60'
  },
  Savings: { 
    gradientStart: '#f59e0b',
    gradientEnd: '#d97706',
    text: 'text-amber-600 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-950/60'
  }
};

// Different shades of blues and purples for non-financial category items & charts
export const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#4f46e5', // Deep Indigo
  '#7c3aed', // Purple Violet
  '#2563eb', // Royal Blue
  '#c084fc', // Light Violet
];

// Warm green palette for income trends
export const INCOME_COLORS = [
  '#22c55e', '#16a34a', '#15803d', '#4ade80', '#86efac'
];

export const CATEGORY_ICONS_Inc = {
  Salary: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  Freelance: <BarChart2 className="w-4 h-4 text-emerald-500" />,
  Investment: <ArrowUp className="w-4 h-4 text-emerald-500" />,
  Bonus: <FileText className="w-4 h-4 text-emerald-500" />,
  Other: <DollarSign className="w-4 h-4 text-emerald-500" />
};

export const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4 text-orange-500" />,
  Housing: <Home className="w-4 h-4 text-indigo-500" />,
  Transport: <Car className="w-4 h-4 text-blue-500" />,
  Shopping: <ShoppingCart className="w-4 h-4 text-purple-500" />,
  Entertainment: <Gift className="w-4 h-4 text-violet-500" />,
  Utilities: <Home className="w-4 h-4 text-cyan-500" />,
  Healthcare: <Heart className="w-4 h-4 text-rose-500" />,
  Salary: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  Freelance: <TrendingDown className="w-4 h-4 text-amber-500" />,
  Other: <DollarSign className="w-4 h-4 text-indigo-500" />
};

// Specific warm icons for income categories
export const INCOME_CATEGORY_ICONS = {
  Salary: <Briefcase className="w-5 h-5 text-emerald-500" />,
  Freelance: <CreditCard className="w-5 h-5 text-emerald-500" />,
  Investment: <TrendingUp className="w-5 h-5 text-emerald-500" />,
  Gift: <Gift className="w-5 h-5 text-emerald-500" />,
  Other: <DollarSign className="w-5 h-5 text-emerald-500" />,
};

// Warm icons for expense categories
export const EXPENSE_CATEGORY_ICONS = {
  Food: <Utensils className="w-5 h-5 text-orange-500" />,
  Housing: <Home className="w-5 h-5 text-amber-500" />,
  Transport: <Car className="w-5 h-5 text-orange-600" />,
  Shopping: <ShoppingBag className="w-5 h-5 text-amber-500" />,
  Entertainment: <Film className="w-5 h-5 text-purple-500" />,
  Utilities: <Wifi className="w-5 h-5 text-blue-500" />,
  Healthcare: <Heart className="w-5 h-5 text-rose-500" />,
  Other: <ShoppingCart className="w-5 h-5 text-orange-500" />,
};

export const colorClasses = {
  income: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/40",
    ring: "ring-emerald-500",
    button: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
  },
  expense: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    text: "text-orange-600 dark:text-amber-300",
    border: "border-orange-200 dark:border-amber-800/40",
    ring: "ring-orange-500",
    button: "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white",
    iconBg: "bg-orange-100 dark:bg-amber-950/60 text-orange-600 dark:text-amber-300",
  },
};
