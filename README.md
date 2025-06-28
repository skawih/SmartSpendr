# SmartSpendr - Expense Tracking Web Application

## Overview
SmartSpendr is a web-based expense tracker designed to help users monitor their monthly spending and manage active subscriptions. The application utilizes local storage to store user data, ensuring accessibility without requiring a backend server.

## Features
- **Monthly Spending Overview**: Track total expenditures with visual summaries.
- **Subscription Management**: View active subscriptions, including status, renewal dates, and amounts.
- **Upcoming Reminders**: Get alerts for upcoming subscription renewals or expirations.
- **Transaction Logging**: Add and categorize transactions for better financial insights.
- **User-Friendly Dashboard**: Intuitive interface displaying key metrics like total outstanding balances and recent activities.

## Screenshots
1. **Login Page**: Secure access to your SmartSpendr account.
2. **Dashboard**: 
   - Displays total spending, recent transactions, and notifications.
   - Lists active subscriptions in a table format.
   - Highlights upcoming reminders with due dates.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Data Storage**: Browser Local Storage (no backend required)

## How to Use
1. **Log In**: Enter your email and password to access the dashboard.
2. **Dashboard Navigation**:
   - Add new transactions or subscriptions.
   - View spending trends and subscription details.
3. **Manage Subscriptions**:
   - Check renewal dates and amounts.
   - Update or cancel plans as needed.
4. **Track Expenses**: Monitor monthly expenditures and set budgets.

## Example Data Structure (Local Storage)
```json
{
  "user": {
    "name": "Hi, Gelo Cruz",
    "notifications": 2,
    "reminders": 3
  },
  "spending": {
    "lastMonth": "48,000",
    "currentMonth": "8,000"
  },
  "subscriptions": [
    {
      "name": "Google Ads Services",
      "status": "Active",
      "renewalDate": "05 Jun 2025",
      "amount": "P 1009"
    }
  ]
}
