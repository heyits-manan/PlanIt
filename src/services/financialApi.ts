// API service layer for financial operations

export interface BudgetFormData {
  name: string;
  description: string;
  totalBudget: string;
  category: string;
  startDate: string;
  endDate: string;
  alertThreshold: string;
}

export interface ExpenseFormData {
  title: string;
  description: string;
  amount: string;
  category: string;
  date: string;
  budgetId?: string;
  receiptUrl?: string;
  isReimbursable: boolean;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: string;
  taxAmount: string;
  totalAmount: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
}

export class FinancialApiService {
  // Budget operations
  static async createBudget(workspaceId: string, budgetData: BudgetFormData) {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...budgetData,
        workspaceId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create budget");
    }

    return response.json();
  }

  static async updateBudget(
    budgetId: number,
    budgetData: BudgetFormData,
    workspaceId: string
  ) {
    const response = await fetch("/api/budgets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...budgetData,
        workspaceId,
        id: budgetId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update budget");
    }

    return response.json();
  }

  static async deleteBudget(budgetId: number) {
    const response = await fetch(`/api/budgets?id=${budgetId}&force=true`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }

    return response.json();
  }

  // Expense operations
  static async createExpense(
    workspaceId: string,
    expenseData: ExpenseFormData
  ) {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...expenseData,
        workspaceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create expense");
    }

    return response.json();
  }

  static async updateExpense(
    expenseId: number,
    expenseData: ExpenseFormData,
    workspaceId: string
  ) {
    const response = await fetch("/api/expenses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...expenseData,
        workspaceId,
        id: expenseId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update expense");
    }

    return response.json();
  }

  static async approveExpense(expenseId: number, notes?: string) {
    const response = await fetch(`/api/expenses/${expenseId}/approve`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", notes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve expense");
    }

    return response.json();
  }

  static async rejectExpense(expenseId: number, notes?: string) {
    const response = await fetch(`/api/expenses/${expenseId}/approve`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", notes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reject expense");
    }

    return response.json();
  }

  // Invoice operations
  static async createInvoice(
    workspaceId: string,
    invoiceData: InvoiceFormData
  ) {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...invoiceData,
        workspaceId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create invoice");
    }

    return response.json();
  }

  static async updateInvoice(
    invoiceId: number,
    invoiceData: InvoiceFormData,
    workspaceId: string
  ) {
    const response = await fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...invoiceData,
        workspaceId,
        id: invoiceId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update invoice");
    }

    return response.json();
  }
}
