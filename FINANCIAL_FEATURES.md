# Financial Management Features

PlanIt now includes comprehensive financial management capabilities to help you track budgets, expenses, invoices, and profitability across your projects.

## Features Overview

### 1. Budget Tracking and Cost Management

- **Budget Creation**: Create budgets for different categories (development, marketing, operations, infrastructure, personnel, other)
- **Budget Monitoring**: Real-time tracking of spent vs. allocated amounts
- **Budget Alerts**: Automatic notifications when budgets approach or exceed limits
- **Budget Categories**: Organize budgets by project phases or expense types

### 2. Real-time Profitability Tracking

- **Profit Margin Calculation**: Automatic calculation of profit margins based on invoiced amounts vs. expenses
- **Financial Dashboard**: Comprehensive overview with key metrics
- **Revenue Tracking**: Monitor total invoiced amounts and payment status
- **Cost Analysis**: Detailed breakdown of expenses by category

### 3. Automated Invoicing and Billing

- **Invoice Creation**: Generate professional invoices with line items
- **Client Management**: Store client information and billing details
- **Invoice Status Tracking**: Track draft, sent, paid, overdue, and cancelled invoices
- **Payment Tracking**: Monitor payment dates and overdue invoices
- **Tax Calculation**: Support for tax amounts and currency options

### 4. Project Cost Forecasting and Budget Alerts

- **Cost Forecasting**: Predict future project costs based on current spending patterns
- **Budget Alerts**: Automatic notifications for:
  - Budget threshold warnings (configurable percentage)
  - Budget overruns
  - Overdue invoices
- **Alert Management**: View and manage all financial alerts in one place

## Database Schema

### New Tables Added

#### Budgets

- `id`: Primary key
- `workspaceId`: Reference to workspace
- `name`: Budget name
- `description`: Optional description
- `totalBudget`: Total allocated amount
- `spentAmount`: Current spent amount
- `category`: Budget category (development, marketing, etc.)
- `startDate`/`endDate`: Budget period
- `alertThreshold`: Percentage threshold for alerts (default 80%)

#### Expenses

- `id`: Primary key
- `workspaceId`: Reference to workspace
- `budgetId`: Optional reference to budget
- `title`: Expense title
- `description`: Optional description
- `amount`: Expense amount
- `category`: Expense category
- `date`: Expense date
- `receiptUrl`: Optional receipt URL
- `isReimbursable`: Boolean flag
- `status`: Approval status (pending, approved, rejected)

#### Invoices

- `id`: Primary key
- `workspaceId`: Reference to workspace
- `invoiceNumber`: Unique invoice number
- `clientName`/`clientEmail`: Client information
- `amount`: Invoice amount
- `taxAmount`: Tax amount
- `totalAmount`: Total including tax
- `currency`: Currency code (default USD)
- `status`: Invoice status
- `issueDate`/`dueDate`/`paidDate`: Important dates

#### Invoice Items

- `id`: Primary key
- `invoiceId`: Reference to invoice
- `description`: Item description
- `quantity`: Item quantity
- `unitPrice`: Price per unit
- `totalPrice`: Total price for item

#### Financial Alerts

- `id`: Primary key
- `workspaceId`: Reference to workspace
- `budgetId`: Optional reference to budget
- `type`: Alert type (budget_alert, invoice_overdue, etc.)
- `title`: Alert title
- `message`: Alert message
- `severity`: Alert severity (low, medium, high, critical)
- `isRead`/`isResolved`: Alert status flags

#### Cost Forecasts

- `id`: Primary key
- `workspaceId`: Reference to workspace
- `projectName`: Project name
- `estimatedCost`: Initial cost estimate
- `actualCost`: Current actual cost
- `forecastedCost`: Updated cost forecast
- `startDate`/`endDate`: Project timeline
- `confidence`: Forecast confidence (1-100%)

## API Endpoints

### Budgets

- `GET /api/budgets?workspaceId={id}` - Get budgets for workspace
- `POST /api/budgets` - Create new budget

### Expenses

- `GET /api/expenses?workspaceId={id}` - Get expenses for workspace
- `POST /api/expenses` - Create new expense

### Invoices

- `GET /api/invoices?workspaceId={id}` - Get invoices for workspace
- `POST /api/invoices` - Create new invoice

### Cost Forecasts

- `GET /api/cost-forecasts?workspaceId={id}` - Get cost forecasts
- `POST /api/cost-forecasts` - Create new cost forecast

### Financial Alerts

- `GET /api/financial-alerts?workspaceId={id}` - Get financial alerts
- `POST /api/financial-alerts` - Create new alert

## Components

### FinancialDashboard

Main dashboard component that provides:

- Overview of all financial metrics
- Tabbed interface for different financial areas
- Real-time data updates
- Summary cards with key metrics

### BudgetCard

Individual budget display with:

- Progress visualization
- Alert indicators
- Budget status (on track, near limit, over budget)
- Quick edit functionality

### ExpenseTracker

Comprehensive expense management with:

- Expense filtering and sorting
- Category-based organization
- Status tracking (pending, approved, rejected)
- Summary statistics

### InvoiceManager

Complete invoice management featuring:

- Invoice status tracking
- Client information management
- Payment monitoring
- Overdue invoice highlighting

## Usage

### Accessing Financial Features

1. Navigate to any workspace
2. Click the "Financial" tab in the workspace navigation
3. Use the dashboard to manage budgets, expenses, and invoices

### Creating a Budget

1. Go to the Financial dashboard
2. Click "Create Budget" in the Budgets tab
3. Fill in budget details (name, amount, category, dates)
4. Set alert threshold (default 80%)

### Adding Expenses

1. Navigate to the Expenses tab
2. Click "Add Expense"
3. Fill in expense details
4. Optionally link to a specific budget

### Creating Invoices

1. Go to the Invoices tab
2. Click "New Invoice"
3. Add client information
4. Add invoice items
5. Set issue and due dates

## Alert System

The system automatically generates alerts for:

- **Budget Threshold**: When spending reaches the alert threshold
- **Budget Overrun**: When spending exceeds the budget
- **Overdue Invoices**: When invoices are past due date

Alerts are categorized by severity:

- **Critical**: Budget overruns, overdue invoices
- **High**: Approaching budget limits
- **Medium**: General budget warnings
- **Low**: Informational alerts

## Future Enhancements

- **Export Functionality**: PDF invoices, financial reports
- **Integration**: Connect with accounting software
- **Advanced Analytics**: Trend analysis, forecasting improvements
- **Multi-currency Support**: Full international currency support
- **Automated Billing**: Recurring invoice generation
- **Payment Processing**: Direct payment integration
