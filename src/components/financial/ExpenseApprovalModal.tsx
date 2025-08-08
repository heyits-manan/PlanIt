"use client";

import React, { useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Receipt } from "lucide-react";

interface ExpenseApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    id: number;
    title: string;
    description?: string;
    amount: string;
    category: string;
    date: string;
    status: string;
    isReimbursable: boolean;
    receiptUrl?: string;
  } | null;
  onApprove: (expenseId: number, notes?: string) => void;
  onReject: (expenseId: number, notes?: string) => void;
}

const ExpenseApprovalModal: React.FC<ExpenseApprovalModalProps> = ({
  isOpen,
  onClose,
  expense,
  onApprove,
  onReject,
}) => {
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleApprove = async () => {
    if (!expense) return;
    setIsSubmitting(true);
    try {
      await onApprove(expense.id, approvalNotes);
      onClose();
    } catch (error) {
      console.error("Error approving expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!expense) return;
    setIsSubmitting(true);
    try {
      await onReject(expense.id, approvalNotes);
      onClose();
    } catch (error) {
      console.error("Error rejecting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Review Expense
              </h2>
              <p className="text-sm text-gray-500">
                Approve or reject this expense request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Expense Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{expense.title}</h3>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>

            {expense.description && (
              <p className="text-sm text-gray-600 mb-3">
                {expense.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {expense.category.charAt(0).toUpperCase() +
                    expense.category.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(expense.date)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Approval
                </span>
              </div>
              {expense.isReimbursable && (
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Reimbursable
                  </span>
                </div>
              )}
            </div>

            {expense.receiptUrl && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-gray-500" />
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View Receipt
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Approval Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about your decision..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </>
              )}
            </button>
            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseApprovalModal;
