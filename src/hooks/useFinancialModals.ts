import { useState } from "react";
import { Budget, Expense, Invoice } from "./useFinancialData";
import {
  FinancialApiService,
  BudgetFormData,
  ExpenseFormData,
  InvoiceFormData,
} from "@/services/financialApi";

export const useFinancialModals = (
  workspaceId: string,
  refetchData: () => void
) => {
  // Modal states
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Editing states
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [approvingExpense] = useState<Expense | null>(null);

  // Loading states
  const [isApproving, setIsApproving] = useState(false);

  // Budget handlers
  const handleCreateBudget = () => {
    setEditingBudget(null);
    setShowBudgetModal(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowBudgetModal(true);
  };

  const handleSubmitBudget = async (budgetData: BudgetFormData) => {
    try {
      if (editingBudget) {
        await FinancialApiService.updateBudget(
          editingBudget.id,
          budgetData,
          workspaceId
        );
      } else {
        await FinancialApiService.createBudget(workspaceId, budgetData);
      }

      setShowBudgetModal(false);
      setEditingBudget(null);
      refetchData();
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      await FinancialApiService.deleteBudget(budgetId);
      refetchData();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  // Expense handlers
  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  const handleSubmitExpense = async (expenseData: ExpenseFormData) => {
    try {
      if (editingExpense) {
        await FinancialApiService.updateExpense(
          editingExpense.id,
          expenseData,
          workspaceId
        );
      } else {
        await FinancialApiService.createExpense(workspaceId, expenseData);
      }

      setShowExpenseModal(false);
      setEditingExpense(null);
      refetchData();
    } catch (error) {
      console.error("Error saving expense:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  // Invoice handlers
  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSubmitInvoice = async (invoiceData: InvoiceFormData) => {
    try {
      if (editingInvoice) {
        await FinancialApiService.updateInvoice(
          editingInvoice.id,
          invoiceData,
          workspaceId
        );
      } else {
        await FinancialApiService.createInvoice(workspaceId, invoiceData);
      }

      setShowInvoiceModal(false);
      setEditingInvoice(null);
      refetchData();
    } catch (error) {
      console.error("Error saving invoice:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  // Expense approval handlers
  const handleApproveExpense = async (expenseId: number, notes?: string) => {
    if (isApproving) return;

    try {
      setIsApproving(true);
      await FinancialApiService.approveExpense(expenseId, notes);
      refetchData();
    } catch (error) {
      console.error("Error approving expense:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectExpense = async (expenseId: number, notes?: string) => {
    if (isApproving) return;

    try {
      setIsApproving(true);
      await FinancialApiService.rejectExpense(expenseId, notes);
      refetchData();
    } catch (error) {
      console.error("Error rejecting expense:", error);
    } finally {
      setIsApproving(false);
    }
  };

  return {
    // Modal states
    showBudgetModal,
    setShowBudgetModal,
    showExpenseModal,
    setShowExpenseModal,
    showInvoiceModal,
    setShowInvoiceModal,
    showApprovalModal,
    setShowApprovalModal,

    // Editing states
    editingBudget,
    setEditingBudget,
    editingExpense,
    setEditingExpense,
    editingInvoice,
    setEditingInvoice,
    approvingExpense,

    // Loading states
    isApproving,

    // Handlers
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
  };
};
