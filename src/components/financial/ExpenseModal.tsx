"use client";

import React, { useState, useEffect } from "react";
import { X, Receipt, Upload } from "lucide-react";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: ExpenseData) => void;
  expense?: ExpenseData | null;
  isEditing?: boolean;
  budgets?: Array<{ id: number; name: string }>;
}

interface ExpenseData {
  title: string;
  description: string;
  amount: string;
  category: string;
  date: string;
  budgetId?: string;
  receiptUrl?: string;
  isReimbursable: boolean;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  expense = null,
  isEditing = false,
  budgets = [],
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    title: "",
    description: "",
    amount: "",
    category: "development",
    date: "",
    budgetId: "",
    receiptUrl: "",
    isReimbursable: false,
  });

  const [errors, setErrors] = useState<Partial<ExpenseData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "development",
    "marketing",
    "operations",
    "infrastructure",
    "personnel",
    "other",
  ];

  useEffect(() => {
    if (expense && isEditing) {
      setFormData({
        title: expense.title,
        description: expense.description || "",
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        budgetId: expense.budgetId || "",
        receiptUrl: expense.receiptUrl || "",
        isReimbursable: expense.isReimbursable,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        amount: "",
        category: "development",
        date: new Date().toISOString().split("T")[0],
        budgetId: "",
        receiptUrl: "",
        isReimbursable: false,
      });
    }
    setErrors({});
  }, [expense, isEditing, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Expense title is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Valid expense amount is required";
    }

    if (!formData.date) {
      newErrors.date = "Expense date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ExpenseData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Expense" : "Add New Expense"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? "Update expense details"
                  : "Record a new project expense"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Expense Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., Software License Renewal"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the expense..."
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Budget Assignment */}
          {budgets.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Budget (Optional)
              </label>
              <select
                value={formData.budgetId}
                onChange={(e) => handleInputChange("budgetId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No budget assignment</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id.toString()}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Receipt URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.receiptUrl}
                onChange={(e) =>
                  handleInputChange("receiptUrl", e.target.value)
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/receipt.pdf"
              />
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Reimbursable Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isReimbursable"
              checked={formData.isReimbursable}
              onChange={(e) =>
                handleInputChange("isReimbursable", e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isReimbursable"
              className="text-sm font-medium text-gray-700"
            >
              This expense is reimbursable
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>{isEditing ? "Update Expense" : "Add Expense"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
