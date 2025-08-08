"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { FinancialAlert } from "@/hooks/useFinancialData";

interface FinancialAlertsProps {
  financialAlerts: FinancialAlert[];
}

const FinancialAlerts: React.FC<FinancialAlertsProps> = ({
  financialAlerts,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Financial Alerts
      </h3>
      <div className="space-y-4">
        {financialAlerts.length > 0 ? (
          financialAlerts.map((alert: FinancialAlert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : alert.severity === "high"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === "critical"
                      ? "bg-red-100 text-red-800"
                      : alert.severity === "high"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No alerts
            </h3>
            <p className="text-gray-500">
              All financial metrics are within normal ranges
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAlerts;
