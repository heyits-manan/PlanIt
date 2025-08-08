"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useFinancialModals } from "@/hooks/useFinancialModals";
import FinancialSummaryCards from "./FinancialSummaryCards";
import FinancialOverview from "./FinancialOverview";
import FinancialAlerts from "./FinancialAlerts";
import BudgetManagement from "./BudgetManagement";
import ExpenseTracker from "./ExpenseTracker";
import InvoiceManager from "./InvoiceManager";
import BudgetModal from "./BudgetModal";
import ExpenseModal from "./ExpenseModal";
import InvoiceModal from "./InvoiceModal";
import ExpenseApprovalModal from "./ExpenseApprovalModal";

interface FinancialDashboardProps {
  workspaceId: string;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  workspaceId,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Use custom hooks for data and modal management
  const {
    budgets,
    expenses,
    invoices,
    financialAlerts,
    summary,
    isLoading,
    isWorkspaceOwner,
    refetchData,
  } = useFinancialData(workspaceId);

  const {
    showBudgetModal,
    setShowBudgetModal,
    showExpenseModal,
    setShowExpenseModal,
    showInvoiceModal,
    setShowInvoiceModal,
    showApprovalModal,
    setShowApprovalModal,
    editingBudget,
    editingExpense,
    setEditingExpense,
    editingInvoice,
    approvingExpense,
    isApproving,
    handleCreateBudget,
    handleEditBudget,
    handleSubmitBudget,
    handleDeleteBudget,
    handleCreateExpense,
    handleEditExpense,
    handleSubmitExpense,
    handleCreateInvoice,
    handleEditInvoice,
    handleSubmitInvoice,
    handleApproveExpense,
    handleRejectExpense,
  } = useFinancialModals(workspaceId, refetchData);

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "budgets", name: "Budgets", icon: DollarSign },
    { id: "expenses", name: "Expenses", icon: TrendingUp },
    { id: "invoices", name: "Invoices", icon: PieChart },
    { id: "alerts", name: "Alerts", icon: AlertTriangle },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your project finances and track profitability
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <FinancialSummaryCards summary={summary} />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <FinancialOverview
              budgets={budgets}
              expenses={expenses}
              financialAlerts={financialAlerts}
            />
          )}

          {activeTab === "budgets" && (
            <BudgetManagement
              budgets={budgets}
              onCreateBudget={handleCreateBudget}
              onEditBudget={handleEditBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === "expenses" && (
            <ExpenseTracker
              workspaceId={workspaceId}
              expenses={expenses}
              onAddExpense={handleCreateExpense}
              onViewExpense={handleEditExpense}
              onApproveExpense={handleApproveExpense}
              onRejectExpense={handleRejectExpense}
              isWorkspaceOwner={isWorkspaceOwner}
              isApproving={isApproving}
            />
          )}

          {activeTab === "invoices" && (
            <InvoiceManager
              workspaceId={workspaceId}
              invoices={invoices}
              onAddInvoice={handleCreateInvoice}
              onViewInvoice={handleEditInvoice}
              onSendInvoice={() => {}}
            />
          )}

          {activeTab === "alerts" && (
            <FinancialAlerts financialAlerts={financialAlerts} />
          )}
        </div>
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleSubmitBudget}
        budget={
          editingBudget
            ? {
                name: editingBudget.name,
                description: editingBudget.description || "",
                totalBudget: editingBudget.totalBudget,
                category: editingBudget.category,
                startDate: editingBudget.startDate,
                endDate: editingBudget.endDate,
                alertThreshold:
                  editingBudget.alertThreshold?.toString() || "80",
              }
            : null
        }
        isEditing={!!editingBudget}
      />

      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmitExpense}
        expense={
          editingExpense
            ? {
                title: editingExpense.title,
                description: editingExpense.description || "",
                amount: editingExpense.amount,
                category: editingExpense.category,
                date: editingExpense.date,
                budgetId: "",
                receiptUrl: editingExpense.receiptUrl || "",
                isReimbursable: editingExpense.isReimbursable,
              }
            : null
        }
        isEditing={!!editingExpense}
        budgets={budgets.map((b) => ({ id: b.id, name: b.name }))}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={handleSubmitInvoice}
        invoice={
          editingInvoice
            ? {
                invoiceNumber: editingInvoice.invoiceNumber,
                clientName: editingInvoice.clientName,
                clientEmail: editingInvoice.clientEmail || "",
                amount: editingInvoice.amount,
                taxAmount: editingInvoice.taxAmount,
                totalAmount: editingInvoice.totalAmount,
                currency: editingInvoice.currency,
                issueDate: editingInvoice.issueDate,
                dueDate: editingInvoice.dueDate,
                notes: editingInvoice.notes || "",
                items: editingInvoice.items || [],
              }
            : null
        }
        isEditing={!!editingInvoice}
      />

      <ExpenseApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        expense={
          approvingExpense
            ? {
                id: approvingExpense.id,
                title: approvingExpense.title,
                description: approvingExpense.description,
                amount: approvingExpense.amount,
                category: approvingExpense.category,
                date: approvingExpense.date,
                status: approvingExpense.status,
                isReimbursable: approvingExpense.isReimbursable,
                receiptUrl: approvingExpense.receiptUrl,
              }
            : null
        }
        onApprove={handleApproveExpense}
        onReject={handleRejectExpense}
      />
    </div>
  );
};

export default FinancialDashboard;
