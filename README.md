# SmartSpendr - Expense Tracking Web Application

## Website Preview Right Here
↪ https://skawih.github.io/SmartSpendr/ ↩

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
   - Light and Dark Mode
<img width="1841" height="926" alt="Screenshot 2025-07-10 200420" src="https://github.com/user-attachments/assets/5e22f5ab-8b9e-41d1-9b8a-2df841425f0e" />
<img width="1844" height="930" alt="image" src="https://github.com/user-attachments/assets/8a6edbcd-8e10-43f9-ab26-0b928691fd54" />
<img width="1844" height="925" alt="image" src="https://github.com/user-attachments/assets/95d0d269-f0f4-490c-980e-bfb59c16069c" />
<img width="1841" height="927" alt="image" src="https://github.com/user-attachments/assets/8a4c80de-d57f-49be-a617-e874f550f22d" />


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
"data-user@example.com": JSON.stringify({
  "transactions": [
    {
      "id": "1678886400000",
      "type": "expense",
      "description": "Groceries",
      "amount": 1500.50,
      "category": "Food",
      "date": "2023-03-15T12:00:00.000Z"
    },
    {
      "id": "1678890000000",
      "type": "income",
      "description": "Freelance Project",
      "amount": 25000.00,
      "category": "Other",
      "date": "2023-03-15T13:00:00.000Z"
    }
  ],
  "subscriptions": [
    {
      "id": "1678900000000",
      "name": "Netflix",
      "amount": 549.00,
      "category": "Streaming",
      "renewalDate": "2023-04-01",
      "date": "2023-03-15T14:00:00.000Z"
    }
  ]
}),
