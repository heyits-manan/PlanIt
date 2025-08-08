"use client";

import { DollarSign, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budgetData: BudgetData) => void;
  budget?: BudgetData | null;
  isEditing?: boolean;
}

interface BudgetData {
  name: string;
  description: string;
  totalBudget: string;
  category: string;
  startDate: string;
  endDate: string;
  alertThreshold: string;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<BudgetData>({
    name: "",
    description: "",
    totalBudget: "",
    category: "development",
    startDate: "",
    endDate: "",
    alertThreshold: "80",
  });

  const [errors, setErrors] = useState<Partial<BudgetData>>({});
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
    if (budget && isEditing) {
      setFormData({
        name: budget.name,
        description: budget.description,
        totalBudget: budget.totalBudget,
        category: budget.category,
        startDate: budget.startDate,
        endDate: budget.endDate,
        alertThreshold: budget.alertThreshold,
      });
    } else {
      // Set default dates for new budget
      const today = new Date();
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );

      setFormData({
        name: "",
        description: "",
        totalBudget: "",
        category: "development",
        startDate: today.toISOString().split("T")[0],
        endDate: nextMonth.toISOString().split("T")[0],
        alertThreshold: "80",
      });
    }
    setErrors({});
  }, [budget, isEditing, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BudgetData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Budget name is required";
    }

    if (!formData.totalBudget || Number(formData.totalBudget) <= 0) {
      newErrors.totalBudget = "Valid budget amount is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (
      !formData.alertThreshold ||
      Number(formData.alertThreshold) < 0 ||
      Number(formData.alertThreshold) > 100
    ) {
      newErrors.alertThreshold = "Alert threshold must be between 0 and 100";
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
      console.error("Error submitting budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BudgetData, value: string) => {
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Budget" : "Create New Budget"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? "Update budget details"
                  : "Set up a new budget for your project"}
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
          {/* Budget Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., Q1 Marketing Budget"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
              placeholder="Describe the purpose of this budget..."
            />
          </div>

          {/* Budget Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Budget *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.totalBudget}
                onChange={(e) =>
                  handleInputChange("totalBudget", e.target.value)
                }
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.totalBudget ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.totalBudget && (
              <p className="mt-1 text-sm text-red-600">{errors.totalBudget}</p>
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Alert Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) =>
                  handleInputChange("alertThreshold", e.target.value)
                }
                className={`w-full pr-8 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.alertThreshold ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="80"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Get notified when spending reaches this percentage of the budget
            </p>
            {errors.alertThreshold && (
              <p className="mt-1 text-sm text-red-600">
                {errors.alertThreshold}
              </p>
            )}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>{isEditing ? "Update Budget" : "Create Budget"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
