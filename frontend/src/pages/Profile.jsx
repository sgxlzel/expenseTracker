import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Coins,
  Download,
  Database,
} from "lucide-react";
import { profileStyles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000/api";

const CURRENCY_OPTIONS = [
  { symbol: "$", code: "USD", name: "US Dollar ($)" },
  { symbol: "€", code: "EUR", name: "Euro (€)" },
  { symbol: "£", code: "GBP", name: "British Pound (£)" },
  { symbol: "₹", code: "INR", name: "Indian Rupee (₹)" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen (¥)" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar (C$)" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar (A$)" },
];

const Profile = () => {
  const context = useOutletContext() || {};
  const {
    transactions = [],
    currency = "$",
    setCurrency = () => {},
  } = context;

  const [currentUser, setCurrentUser] = useState(() => {
    if (context.user) return context.user;
    try {
      const stored =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [transactions]
  );

  const netBalance = totalIncome - totalExpense;

  const handleDownloadCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }
    const headers = ["ID,Date,Type,Category,Description,Amount"];
    const rows = transactions.map((t) => {
      const dateStr = t.date ? new Date(t.date).toISOString().split("T")[0] : "";
      const desc = `"${(t.description || "").replace(/"/g, '""')}"`;
      return `${t.id || ""},${dateStr},${t.type},${t.category},${desc},${t.amount}`;
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `TrackExpense_Transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions available to export.");
      return;
    }
    const data = {
      user: currentUser,
      exportedAt: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions: transactions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `TrackExpense_Backup_${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Sync form data whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  // Fetch latest user details on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedUser = res.data?.user || res.data;
        if (fetchedUser) {
          setCurrentUser(fetchedUser);
          if (localStorage.getItem("token")) {
            localStorage.setItem("user", JSON.stringify(fetchedUser));
          } else if (sessionStorage.getItem("token")) {
            sessionStorage.setItem("user", JSON.stringify(fetchedUser));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserData();
  }, []);

  // Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setProfileError("Name and Email are required");
      return;
    }

    try {
      setProfileLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE}/users/profile`,
        { name: formData.name, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data?.user || {
        ...currentUser,
        name: formData.name,
        email: formData.email,
      };

      setCurrentUser(updated);
      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(updated));
      } else if (sessionStorage.getItem("token")) {
        sessionStorage.setItem("user", JSON.stringify(updated));
      }

      setProfileSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setProfileError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Please enter all required fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE}/users/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Password change failed:", err);
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const initial =
    currentUser?.name?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.mainContainer}>
        {/* Header with avatar */}
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <span className="text-3xl font-bold text-white">{initial}</span>
          </div>
          <h1 className={profileStyles.userName}>
            {currentUser?.name || "User"}
          </h1>
          <p className={profileStyles.userEmail}>
            {currentUser?.email || "No email provided"}
          </p>
        </div>

        {/* Content body */}
        <div className={profileStyles.content}>
          {profileSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Lifetime Account Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Lifetime Income</span>
              <span className="text-lg font-bold text-emerald-600 mt-1">
                +{currency}{totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Lifetime Expenses</span>
              <span className="text-lg font-bold text-orange-600 mt-1">
                -{currency}{totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Net Savings</span>
              <span
                className={`text-lg font-bold mt-1 ${
                  netBalance >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {netBalance >= 0 ? "+" : "-"}{currency}{Math.abs(netBalance).toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Total Records</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                {transactions.length}
              </span>
            </div>
          </div>

          <div className={profileStyles.grid}>
            {/* Card 1: Personal Information */}
            <div className={profileStyles.card}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={profileStyles.cardTitle}>
                  <User className={profileStyles.icon} />
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={profileStyles.editButton}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className={profileStyles.label}>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={profileStyles.input}
                      required
                    />
                  </div>

                  <div>
                    <label className={profileStyles.label}>Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={profileStyles.input}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className={profileStyles.buttonPrimary}
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: currentUser?.name || "",
                          email: currentUser?.email || "",
                        });
                        setProfileError("");
                      }}
                      className={profileStyles.buttonSecondary}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className={profileStyles.label}>Full Name</span>
                    <p className="text-gray-800 dark:text-slate-100 font-medium">
                      {currentUser?.name || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <span className={profileStyles.label}>Email Address</span>
                    <p className="text-gray-800 dark:text-slate-100 font-medium">
                      {currentUser?.email || "Not specified"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Security & Password */}
            <div className={profileStyles.card}>
              <h3 className={profileStyles.cardTitle}>
                <Shield className={profileStyles.icon} />
                Security
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Manage your password and security credentials
              </p>

              <div className={profileStyles.securityItem}>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">Password</p>
                  <p className={profileStyles.securityText}>••••••••••••</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={profileStyles.changeButton}
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Card 3: Display Currency Preferences */}
            <div className={profileStyles.card}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={profileStyles.cardTitle}>
                  <Coins className={profileStyles.icon} />
                  Display Currency
                </h3>
                <span className="text-xs font-semibold px-2 py-1 bg-teal-100 text-teal-800 rounded-lg">
                  Active: {currency}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Choose the currency symbol used across your dashboard and charts.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CURRENCY_OPTIONS.map((opt) => {
                  const isSelected = currency === opt.symbol;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setCurrency(opt.symbol)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm ring-1 ring-teal-500"
                          : "bg-white dark:bg-[#181938] border-gray-200 dark:border-[#2f3166] text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-[#202c47] hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <span>{opt.code}</span>
                      <span className="font-bold text-base">{opt.symbol}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span>Preview:</span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm">
                  {currency}1,250.00
                </span>
              </div>
            </div>

            {/* Card 4: Data Management & Backups */}
            <div className={profileStyles.card}>
              <h3 className={profileStyles.cardTitle}>
                <Database className={profileStyles.icon} />
                Data & Backups
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Export your entire financial transaction history for offline backup or spreadsheets.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-[#252752]">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                      Export CSV Spreadsheet
                    </p>
                    <p className="text-xs text-gray-500">
                      Compatible with Excel, Google Sheets & Numbers
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white dark:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-[#252752]">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                      Export JSON Backup
                    </p>
                    <p className="text-xs text-gray-500">
                      Raw structured data file of your records
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    JSON
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>Total records available:</span>
                <span className="font-semibold text-gray-700">
                  {transactions.length} transactions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white dark:bg-[#141530] rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-transparent dark:border-[#252752]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-600" />
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className={profileStyles.passwordLabel}>
                  Current Password
                </label>
                <div className={profileStyles.passwordContainer}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className={profileStyles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className={profileStyles.passwordToggle}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={profileStyles.passwordLabel}>
                  New Password (min 6 characters)
                </label>
                <div className={profileStyles.passwordContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className={profileStyles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={profileStyles.passwordToggle}
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={profileStyles.passwordLabel}>
                  Confirm New Password
                </label>
                <div className={profileStyles.passwordContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={profileStyles.input}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={profileStyles.buttonPrimary}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={profileStyles.buttonSecondary}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

