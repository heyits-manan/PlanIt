"use client";

import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Plus,
  Send,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface Invoice {
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

interface InvoiceManagerProps {
  workspaceId: string;
  invoices: Invoice[];
  onAddInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onSendInvoice: (invoiceId: number) => void;
}

const InvoiceManager: React.FC<InvoiceManagerProps> = ({
  invoices,
  onAddInvoice,
  onViewInvoice,
  onSendInvoice,
}) => {
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const statuses = ["draft", "sent", "paid", "overdue", "cancelled"];

  useEffect(() => {
    let filtered = [...invoices];

    if (filterStatus !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === filterStatus);
    }

    // Sort invoices
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return Number(b.totalAmount) - Number(a.totalAmount);
        case "date":
          return (
            new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          );
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredInvoices(filtered);
  }, [invoices, filterStatus, sortBy]);

  const formatCurrency = (amount: string, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "sent":
        return <Send className="w-5 h-5 text-blue-500" />;
      case "overdue":
        return <Clock className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (invoice: Invoice) => {
    return invoice.status === "sent" && new Date(invoice.dueDate) < new Date();
  };

  const totalInvoiced = filteredInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0
  );

  const paidInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "paid"
  );
  const pendingInvoices = filteredInvoices.filter(
    (invoice) => invoice.status === "sent"
  );
  const overdueInvoices = filteredInvoices.filter((invoice) =>
    isOverdue(invoice)
  );

  const totalPaid = paidInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0
  );
  const totalPending = pendingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Manager</h2>
          <p className="text-gray-600">Create and manage client invoices</p>
        </div>
        <button
          onClick={onAddInvoice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Total Invoiced
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {formatCurrency(totalInvoiced.toString())}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Paid</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {formatCurrency(totalPaid.toString())}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {formatCurrency(totalPending.toString())}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {overdueInvoices.length} invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center space-x-4 mb-6">
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Issue Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                isOverdue(invoice)
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Invoice #{invoice.invoiceNumber}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                    {isOverdue(invoice) && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {invoice.clientName}
                  </p>
                  {invoice.clientEmail && (
                    <p className="text-sm text-gray-500 mb-2">
                      {invoice.clientEmail}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Issued: {formatDate(invoice.issueDate)}</span>
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                    {invoice.paidDate && (
                      <span>Paid: {formatDate(invoice.paidDate)}</span>
                    )}
                  </div>
                  {invoice.items && invoice.items.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {invoice.items.length} item
                      {invoice.items.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </p>
                    {Number(invoice.taxAmount) > 0 && (
                      <p className="text-sm text-gray-500">
                        Tax:{" "}
                        {formatCurrency(invoice.taxAmount, invoice.currency)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(invoice.status)}
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {invoice.status === "draft" && (
                      <button
                        onClick={() => onSendInvoice(invoice.id)}
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                        title="Send Invoice"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500">
              {filterStatus !== "all"
                ? "No invoices match your current filters"
                : "Get started by creating your first invoice"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManager;
