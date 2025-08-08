import { useState, useEffect, useCallback } from "react";

export interface Budget {
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
  alertThreshold?: number;
}

export interface Expense {
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

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  amount: string;
  taxAmount: string;
  totalAmount: string;
  currency: string;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  items: InvoiceItem[];
}

export interface FinancialAlert {
  id: number;
  title: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  isRead: boolean;
  workspaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalBudget: number;
  totalSpent: number;
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
  profitMargin: number;
}

export const useFinancialData = (workspaceId: string) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [financialAlerts, setFinancialAlerts] = useState<FinancialAlert[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBudget: 0,
    totalSpent: 0,
    totalInvoiced: 0,
    totalPaid: 0,
    totalPending: 0,
    profitMargin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState(false);

  const fetchFinancialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch workspace data to determine ownership
      const workspaceRes = await fetch(`/api/workspaces/${workspaceId}`);
      let workspaceData = null;
      if (workspaceRes.ok) {
        workspaceData = await workspaceRes.json();
      } else {
        console.error("Failed to fetch workspace:", workspaceRes.status);
      }

      // Fetch all financial data in parallel
      const [budgetsRes, expensesRes, invoicesRes, alertsRes] =
        await Promise.all([
          fetch(`/api/budgets?workspaceId=${workspaceId}`),
          fetch(`/api/expenses?workspaceId=${workspaceId}`),
          fetch(`/api/invoices?workspaceId=${workspaceId}`),
          fetch(`/api/financial-alerts?workspaceId=${workspaceId}`),
        ]);

      const [budgetsData, expensesData, invoicesData, alertsData] =
        await Promise.all([
          budgetsRes.json(),
          expensesRes.json(),
          invoicesRes.json(),
          alertsRes.json(),
        ]);

      // Transform budgets data to match the expected interface
      const transformedBudgets = budgetsData.map(
        (budget: Record<string, unknown>) => ({
          ...budget,
          spentAmount: Number(budget.spentAmount) || 0,
          remainingAmount: Number(budget.remainingAmount) || 0,
          spentPercentage: Number(budget.spentPercentage) || 0,
          isOverBudget: Boolean(budget.isOverBudget),
          isNearLimit: Boolean(budget.isNearLimit),
        })
      );

      // Transform expenses data to match the expected interface
      const transformedExpenses = expensesData.map(
        (expense: Record<string, unknown>) => ({
          ...expense,
          createdBy: expense.userId || expense.createdBy || "unknown",
        })
      );

      // Transform invoices data to match the expected interface
      const transformedInvoices = invoicesData.map(
        (invoice: Record<string, unknown>) => ({
          ...invoice,
          amount: invoice.subtotal || invoice.amount || "0",
          items: invoice.items || [],
        })
      );

      setBudgets(transformedBudgets);
      setExpenses(transformedExpenses);
      setInvoices(transformedInvoices);
      setFinancialAlerts(alertsData);

      // Determine if current user is workspace owner
      if (workspaceData) {
        const userResponse = await fetch("/api/users");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const isOwner = workspaceData.ownerId === userData.id;
          setIsWorkspaceOwner(isOwner);
        } else {
          console.error("Failed to fetch user info:", userResponse.status);
        }
      }

      // Calculate summary
      const totalBudget = transformedBudgets.reduce(
        (sum: number, b: Budget) => sum + Number(b.totalBudget),
        0
      );
      const totalSpent = transformedExpenses.reduce(
        (sum: number, e: Expense) => sum + Number(e.amount),
        0
      );
      const totalInvoiced = transformedInvoices.reduce(
        (sum: number, i: Invoice) => sum + Number(i.totalAmount),
        0
      );

      const totalPaid = transformedInvoices
        .filter((i: Invoice) => i.status === "paid")
        .reduce((sum: number, i: Invoice) => sum + Number(i.totalAmount), 0);

      const totalPending = transformedInvoices
        .filter((i: Invoice) => i.status !== "paid")
        .reduce((sum: number, i: Invoice) => sum + Number(i.totalAmount), 0);

      const profitMargin = totalInvoiced
        ? Math.round(((totalInvoiced - totalSpent) / totalInvoiced) * 100)
        : 0;

      setSummary({
        totalBudget,
        totalSpent,
        totalInvoiced,
        totalPaid,
        totalPending,
        profitMargin,
      });
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    budgets,
    expenses,
    invoices,
    financialAlerts,
    summary,
    isLoading,
    isWorkspaceOwner,
    refetchData: fetchFinancialData,
  };
};
