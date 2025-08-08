"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import BudgetCard from "./BudgetCard";
import { Budget, Expense, FinancialAlert } from "@/hooks/useFinancialData";

interface FinancialOverviewProps {
  budgets: Budget[];
  expenses: Expense[];
  financialAlerts: FinancialAlert[];
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  budgets,
  expenses,
  financialAlerts,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.slice(0, 6).map((budget: Budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Expenses
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {expenses.slice(0, 5).map((expense: Expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="font-medium text-gray-900">{expense.title}</p>
                <p className="text-sm text-gray-500">{expense.category}</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatCurrency(Number(expense.amount))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Alerts */}
      {financialAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {financialAlerts.slice(0, 3).map((alert: FinancialAlert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : alert.severity === "high"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;
