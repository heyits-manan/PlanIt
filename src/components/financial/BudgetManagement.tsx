"use client";

import React from "react";
import BudgetCard from "./BudgetCard";
import { Budget } from "@/hooks/useFinancialData";

interface BudgetManagementProps {
  budgets: Budget[];
  onCreateBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (budgetId: number) => void;
}

const BudgetManagement: React.FC<BudgetManagementProps> = ({
  budgets,
  onCreateBudget,
  onEditBudget,
  onDeleteBudget,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Budget Management
        </h3>
        <button
          onClick={onCreateBudget}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Create Budget
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget: Budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={onEditBudget}
            onDelete={onDeleteBudget}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetManagement;
