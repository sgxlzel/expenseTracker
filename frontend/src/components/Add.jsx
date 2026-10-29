import React from 'react';
import { X } from 'lucide-react';
import { modalStyles } from '../assets/dummyStyles';

export const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Salary", "Freelance", "Investments", "Bonus", "Other"],
  color = "teal"
}) => {
  if (!showModal) return null;

  // Current date in YYYY-MM-DD format, built from local time
  // (toISOString() uses UTC and can be a day off near midnight)
  const today = new Date();
  const currentYear = today.getFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  const currentDate = `${currentYear}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const minDate = `${currentYear}-01-01`;

  // fall back to teal if an unknown color is passed
  const colorClass = modalStyles.colorClasses[color] || modalStyles.colorClasses.teal;

  // update a single field of the transaction
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setNewTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTransaction(e);
  };

  return (
    <div className={modalStyles.overlay} onClick={() => setShowModal(false)}>
      <div
        className={modalStyles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className={modalStyles.modalHeader}>
          <h3 className={modalStyles.modalTitle}>{title}</h3>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className={modalStyles.closeButton}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={modalStyles.form}>
          {/* type selector (only when the modal handles both income and expense) */}
          {type === "both" && (
            <div>
              <label className={modalStyles.label}>Type</label>
              <div className={modalStyles.typeButtonContainer}>
                <button
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'income',
                    modalStyles.colorClasses.teal.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income' }))}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'expense',
                    modalStyles.colorClasses.orange.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense' }))}
                >
                  Expense
                </button>
              </div>
            </div>
          )}

          {/* description */}
          <div>
            <label className={modalStyles.label}>Description</label>
            <input
              type="text"
              value={newTransaction.description || ""}
              onChange={handleChange("description")}
              placeholder="e.g. Groceries"
              className={modalStyles.input(colorClass.ring)}
              required
            />
          </div>

          {/* amount */}
          <div>
            <label className={modalStyles.label}>Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={newTransaction.amount || ""}
              onChange={handleChange("amount")}
              placeholder="0.00"
              className={modalStyles.input(colorClass.ring)}
              required
            />
          </div>

          {/* category */}
          <div>
            <label className={modalStyles.label}>Category</label>
            <select
              value={newTransaction.category || ""}
              onChange={handleChange("category")}
              className={modalStyles.input(colorClass.ring)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* date (this year only, no future dates) */}
          <div>
            <label className={modalStyles.label}>Date</label>
            <input
              type="date"
              min={minDate}
              max={currentDate}
              value={newTransaction.date || currentDate}
              onChange={handleChange("date")}
              className={modalStyles.input(colorClass.ring)}
              required
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            className={modalStyles.submitButton(colorClass.button)}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;