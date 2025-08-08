"use client";

import React from "react";
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface BudgetCardProps {
  budget: {
    id: number;
    name: string;
    description?: string;
    totalBudget: string;
    spentAmount: number;
    remainingAmount: number;
    spentPercentage: number;
    isOverBudget: boolean;
    isNearLimit: boolean;
    category: string;
    startDate: string;
    endDate: string;
  };
  onEdit?: (budget: BudgetCardProps["budget"]) => void;
  onDelete?: (budgetId: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  const getProgressColor = () => {
    if (budget.isOverBudget) return "bg-red-500";
    if (budget.isNearLimit) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = () => {
    if (budget.isOverBudget)
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    if (budget.isNearLimit)
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <TrendingUp className="w-5 h-5 text-green-500" />;
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {budget.name}
            </h3>
            {getStatusIcon()}
          </div>
          {budget.description && (
            <p className="text-sm text-gray-600 mb-2">{budget.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {budget.category}
            </span>
            <span>
              {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
            </span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                title="Edit Budget"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(budget.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                title="Delete Budget"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Budget</span>
          <span className="font-medium">
            {formatCurrency(budget.totalBudget)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span
            className={`font-medium ${
              budget.isOverBudget ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatCurrency(budget.spentAmount)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span
            className={`font-medium ${
              budget.isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(budget.remainingAmount)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(budget.spentPercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{budget.spentPercentage.toFixed(1)}% used</span>
          <span>
            {budget.isOverBudget
              ? `${Math.abs(budget.spentPercentage - 100).toFixed(
                  1
                )}% over budget`
              : `${(100 - budget.spentPercentage).toFixed(1)}% remaining`}
          </span>
        </div>
      </div>

      {budget.isOverBudget && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 font-medium">
              Budget exceeded by{" "}
              {formatCurrency(Math.abs(budget.remainingAmount))}
            </span>
          </div>
        </div>
      )}

      {budget.isNearLimit && !budget.isOverBudget && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-700 font-medium">
              Approaching budget limit
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
