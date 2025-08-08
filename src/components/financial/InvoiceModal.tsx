"use client";

import { FileText, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoiceData: InvoiceData) => void;
  invoice?: InvoiceData | null;
  isEditing?: boolean;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface InvoiceData {
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
  items: InvoiceItem[];
}

interface InvoiceErrors {
  invoiceNumber?: string;
  clientName?: string;
  clientEmail?: string;
  amount?: string;
  taxAmount?: string;
  totalAmount?: string;
  currency?: string;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  items?: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  invoice = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: "",
    clientName: "",
    clientEmail: "",
    amount: "",
    taxAmount: "0",
    totalAmount: "",
    currency: "USD",
    issueDate: "",
    dueDate: "",
    notes: "",
    items: [{ description: "", quantity: 1, unitPrice: "", totalPrice: "0" }],
  });

  const [errors, setErrors] = useState<InvoiceErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

  useEffect(() => {
    if (invoice && isEditing) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail || "",
        amount: invoice.amount,
        taxAmount: invoice.taxAmount || "0",
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        notes: invoice.notes || "",
        items:
          invoice.items.length > 0
            ? invoice.items
            : [
                {
                  description: "",
                  quantity: 1,
                  unitPrice: "",
                  totalPrice: "0",
                },
              ],
      });
    } else {
      // Generate invoice number for new invoice
      const today = new Date();
      const invoiceNumber = `INV-${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate()).padStart(
        2,
        "0"
      )}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

      setFormData({
        invoiceNumber,
        clientName: "",
        clientEmail: "",
        amount: "",
        taxAmount: "0",
        totalAmount: "",
        currency: "USD",
        issueDate: today.toISOString().split("T")[0],
        dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        notes: "",
        items: [
          { description: "", quantity: 1, unitPrice: "", totalPrice: "0" },
        ],
      });
    }
    setErrors({});
  }, [invoice, isEditing, isOpen]);

  const calculateItemTotal = (quantity: number, unitPrice: string): string => {
    return (quantity * Number(unitPrice)).toFixed(2);
  };

  const calculateInvoiceTotal = useCallback((): void => {
    const itemsTotal = formData.items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0
    );
    const taxAmount = Number(formData.taxAmount);
    const total = itemsTotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      amount: itemsTotal.toFixed(2),
      totalAmount: total.toFixed(2),
    }));
  }, [formData.items, formData.taxAmount]);

  useEffect(() => {
    calculateInvoiceTotal();
  }, [calculateInvoiceTotal]);

  const validateForm = (): boolean => {
    const newErrors: InvoiceErrors = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.issueDate &&
      formData.dueDate &&
      new Date(formData.issueDate) >= new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "Due date must be after issue date";
    }

    // Validate items
    const validItems = formData.items.filter(
      (item) => item.description.trim() && Number(item.unitPrice) > 0
    );
    if (validItems.length === 0) {
      newErrors.items = "At least one valid item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice = calculateItemTotal(
        typeof value === "number" ? value : Number(newItems[index].quantity),
        field === "unitPrice" ? String(value) : newItems[index].unitPrice
      );
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unitPrice: "", totalPrice: "0" },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Invoice" : "Create New Invoice"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? "Update invoice details"
                  : "Generate a new invoice for your client"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  handleInputChange("invoiceNumber", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.invoiceNumber ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="INV-2024-001"
              />
              {errors.invoiceNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.invoiceNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.clientName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Client Company Name"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Email
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  handleInputChange("clientEmail", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="client@example.com"
              />
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issueDate ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.issueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Invoice Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Item {index + 1}
                    </h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Item description"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-sm font-medium text-gray-700">
                      Total: {formData.currency} {item.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="mt-1 text-sm text-red-600">{errors.items}</p>
            )}
          </div>

          {/* Tax Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.currency === "USD" ? "$" : formData.currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.taxAmount}
                onChange={(e) => handleInputChange("taxAmount", e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes for the invoice..."
            />
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Subtotal:
              </span>
              <span className="text-sm text-gray-900">
                {formData.currency} {formData.amount}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Tax:</span>
              <span className="text-sm text-gray-900">
                {formData.currency} {formData.taxAmount}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formData.currency} {formData.totalAmount}
              </span>
            </div>
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
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{isEditing ? "Update Invoice" : "Create Invoice"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
