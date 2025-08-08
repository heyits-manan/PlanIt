"use client";

import React from "react";
import { DollarSign, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import { FinancialSummary } from "@/hooks/useFinancialData";

interface FinancialSummaryCardsProps {
  summary: FinancialSummary;
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  summary,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getProfitColor = (margin: number) => {
    if (margin >= 20) return "text-green-600";
    if (margin >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalSpent)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <PieChart className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalInvoiced)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Profit Margin</p>
            <p
              className={`text-2xl font-bold ${getProfitColor(
                summary.profitMargin
              )}`}
            >
              {summary.profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCards;
