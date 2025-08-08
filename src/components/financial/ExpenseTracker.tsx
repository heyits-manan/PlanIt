"use client";

import { CheckCircle, Eye, Filter, Plus, Receipt, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: string;
  category: string;
  date: string;
  status: string;
  isReimbursable: boolean;
  receiptUrl?: string;
  createdBy: string;
}

interface ExpenseTrackerProps {
  workspaceId: string;
  expenses: Expense[];
  onAddExpense: () => void;
  onViewExpense: (expense: Expense) => void;
  onApproveExpense?: (expenseId: number, notes?: string) => void;
  onRejectExpense?: (expenseId: number, notes?: string) => void;
  isWorkspaceOwner?: boolean;
  isApproving?: boolean;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  onAddExpense,
  onViewExpense,
  onApproveExpense,
  onRejectExpense,
  isWorkspaceOwner = false,
  isApproving = false,
}) => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const categories = [
    "development",
    "marketing",
    "operations",
    "infrastructure",
    "personnel",
    "other",
  ];

  const statuses = ["pending", "approved", "rejected"];

  // Get available months from expenses
  const getAvailableMonths = () => {
    const months = new Set<string>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const getMonthlyTotal = (monthKey: string) => {
    const monthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      const expenseMonthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return expenseMonthKey === monthKey;
    });
    return monthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  };

  useEffect(() => {
    let filtered = [...expenses];

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === filterCategory
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((expense) => expense.status === filterStatus);
    }

    if (filterMonth !== "all") {
      filtered = filtered.filter((expense) => {
        const date = new Date(expense.date);
        const expenseMonthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        return expenseMonthKey === filterMonth;
      });
    }

    // Sort expenses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return Number(b.amount) - Number(a.amount);
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [expenses, filterCategory, filterStatus, filterMonth, sortBy]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return (
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      development: "bg-blue-100 text-blue-800",
      marketing: "bg-purple-100 text-purple-800",
      operations: "bg-green-100 text-green-800",
      infrastructure: "bg-orange-100 text-orange-800",
      personnel: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // approvedExpenses is calculated but not used in current implementation
  // const approvedExpenses = filteredExpenses.filter(
  //   (expense) => expense.status === "approved"
  // );
  const pendingExpenses = filteredExpenses.filter(
    (expense) => expense.status === "pending"
  );
  const approvedExpensesList = filteredExpenses.filter(
    (expense) => expense.status === "approved"
  );
  const rejectedExpensesList = filteredExpenses.filter(
    (expense) => expense.status === "rejected"
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Tracker</h2>
          <p className="text-gray-600">
            Track and manage your project expenses
          </p>
        </div>
        <button
          onClick={onAddExpense}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {filterMonth === "all" ? "Total Expenses" : "Monthly Expenses"}
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {filterMonth === "all"
              ? formatCurrency(totalExpenses.toString())
              : formatCurrency(getMonthlyTotal(filterMonth).toString())}
          </p>
          {filterMonth !== "all" && (
            <p className="text-xs text-blue-700 mt-1">
              {formatMonthDisplay(filterMonth)}
            </p>
          )}
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {formatCurrency(
              approvedExpensesList
                .reduce((sum, expense) => sum + Number(expense.amount), 0)
                .toString()
            )}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {formatCurrency(
              pendingExpenses
                .reduce((sum, expense) => sum + Number(expense.amount), 0)
                .toString()
            )}
          </p>
          {isWorkspaceOwner && pendingExpenses.length > 0 && (
            <p className="text-xs text-yellow-700 mt-1">
              {pendingExpenses.length} expense
              {pendingExpenses.length !== 1 ? "s" : ""} need
              {pendingExpenses.length !== 1 ? "" : "s"} approval
            </p>
          )}
          {!isWorkspaceOwner && pendingExpenses.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {pendingExpenses.length} pending expense
              {pendingExpenses.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {formatCurrency(
              rejectedExpensesList
                .reduce((sum, expense) => sum + Number(expense.amount), 0)
                .toString()
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Months</option>
            {getAvailableMonths().map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {formatMonthDisplay(monthKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {currentExpenses.length > 0 ? (
          currentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {expense.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(expense.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </div>
                    {expense.isReimbursable && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        Reimbursable
                      </span>
                    )}
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {expense.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewExpense(expense)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    {/* Approval buttons for workspace owners */}
                    {isWorkspaceOwner &&
                      expense.status === "pending" &&
                      onApproveExpense &&
                      onRejectExpense && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isApproving) {
                                onApproveExpense(expense.id);
                              }
                            }}
                            disabled={isApproving}
                            className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium ${
                              isApproving
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }`}
                            title="Approve Expense"
                            type="button"
                          >
                            {isApproving ? (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span>
                              {isApproving ? "Approving..." : "Approve"}
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isApproving) {
                                onRejectExpense(expense.id);
                              }
                            }}
                            disabled={isApproving}
                            className={`px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 text-sm font-medium ${
                              isApproving
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-700 hover:bg-red-50"
                            }`}
                            title="Reject Expense"
                            type="button"
                          >
                            {isApproving ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>
                              {isApproving ? "Rejecting..." : "Reject"}
                            </span>
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No expenses found
            </h3>
            <p className="text-gray-500">
              {filterCategory !== "all" || filterStatus !== "all"
                ? "No expenses match your current filters"
                : "Get started by adding your first expense"}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredExpenses.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredExpenses.length)} of{" "}
              {filteredExpenses.length} expenses
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
