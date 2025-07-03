// Data storage
let transactions = [];
let subscriptions = [];
// Modal functions
function showModal(id) {
 document.getElementById(id).classList.add('active');
}
function hideModal(id) {
 document.getElementById(id).classList.remove('active');
}
// Login/Logout
document.getElementById('login-form').addEventListener('submit', function(e) {
 e.preventDefault();
 document.getElementById('login-page').classList.remove('active');
 document.getElementById('dashboard-page').classList.add('active');
 // Load any saved data when logging in
 loadData();
});
document.getElementById('logout-btn').addEventListener('click', function() {
    // Clear the UI
    document.getElementById('transactions-list').innerHTML = '<p class="empty-state">No transactions yet</p>';
    document.getElementById('subscriptions-list').innerHTML = '<p class="empty-state">No subscriptions yet</p>';
    document.getElementById('renewals-list').innerHTML = '<p class="empty-state">No upcoming renewals</p>';
    // Reset overview cards
    document.getElementById('current-month').textContent = '₱0';
    document.getElementById('last-month').textContent = '₱0';
    document.getElementById('active-subs').textContent = '0';
    document.getElementById('notifications').textContent = '0';
    // Switch pages
    document.getElementById('dashboard-page').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
    // Reset form values (optional)
    document.getElementById('transaction-form').reset();
    document.getElementById('subscription-form').reset();
});
// Transaction Form Handling
document.getElementById('transaction-form').addEventListener('submit', function(e) {
 e.preventDefault();
 const type = document.querySelector('#transaction-form input[name="type"]:checked').value;
 const description = document.getElementById('transaction-desc').value;
 const amount = parseFloat(document.getElementById('transaction-amount').value);
 const category = document.getElementById('transaction-category').value;
 const date = new Date().toISOString();
 const transaction = {
   type,
   description,
   amount,
   category,
   date
 };
 transactions.push(transaction);
 addTransactionToUI(transaction);
 updateOverviewCards();
 saveData();
 this.reset();
 hideModal('transaction-modal');
});
// Subscription Form Handling
document.getElementById('subscription-form').addEventListener('submit', function(e) {
 e.preventDefault();
 const name = document.getElementById('subscription-name').value;
 const amount = parseFloat(document.getElementById('subscription-amount').value);
 const category = document.getElementById('subscription-category').value;
 const renewalDate = document.getElementById('subscription-renewal').value;
 const subscription = {
   name,
   amount,
   category,
   renewalDate
 };
 subscriptions.push(subscription);
 addSubscriptionToUI(subscription);
 updateOverviewCards();
 saveData();
 this.reset();
 hideModal('subscription-modal');
});
// UI Update Functions
function addTransactionToUI(transaction) {
 const list = document.getElementById('transactions-list');
 const emptyState = list.querySelector('.empty-state');
 if (emptyState) {
   list.removeChild(emptyState);
 }
 const item = document.createElement('div');
 item.className = 'transaction-item';
 item.innerHTML = `
<div class="transaction-info">
<h4>${transaction.description}</h4>
<p>${transaction.category}</p>
<p class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</p>
</div>
<div class="transaction-amount ${transaction.type}">
     ₱${transaction.amount.toFixed(2)}
</div>
 `;
 list.prepend(item);
}
function addSubscriptionToUI(subscription) {
 const list = document.getElementById('subscriptions-list');
 const emptyState = list.querySelector('.empty-state');
 if (emptyState) {
   list.removeChild(emptyState);
 }
 const item = document.createElement('div');
 item.className = 'subscription-item';
 item.innerHTML = `
<div class="subscription-info">
<h4>${subscription.name}</h4>
<p>${subscription.category}</p>
<p class="subscription-renewal">Renews: ${new Date(subscription.renewalDate).toLocaleDateString()}</p>
</div>
<div class="subscription-amount">
     ₱${subscription.amount.toFixed(2)}/mo
</div>
 `;
 list.prepend(item);
 updateRenewalsList();
}
function updateOverviewCards() {
 // Update current month total
 const currentMonthTotal = transactions
   .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
   .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
 document.getElementById('current-month').textContent = `₱${currentMonthTotal.toFixed(2)}`;
 // Update active subscriptions count
 document.getElementById('active-subs').textContent = subscriptions.length;
}
function updateRenewalsList() {
 const renewalsList = document.getElementById('renewals-list');
 const emptyState = renewalsList.querySelector('.empty-state');
 if (subscriptions.length === 0) {
   if (!emptyState) {
     renewalsList.innerHTML = '<p class="empty-state">No upcoming renewals</p>';
   }
   return;
 }
 if (emptyState) {
   renewalsList.removeChild(emptyState);
 }
 // Sort subscriptions by renewal date
 const sortedSubs = [...subscriptions].sort((a, b) =>
   new Date(a.renewalDate) - new Date(b.renewalDate));
 // Clear and rebuild renewals list
 renewalsList.innerHTML = '';
 sortedSubs.forEach(sub => {
   const item = document.createElement('div');
   item.className = 'renewal-item';
   item.innerHTML = `
<div class="renewal-name">${sub.name}</div>
<div class="renewal-details">
<div class="renewal-amount">₱${sub.amount.toFixed(2)}</div>
<div class="renewal-date">${new Date(sub.renewalDate).toLocaleDateString()}</div>
</div>
   `;
   renewalsList.appendChild(item);
 });
}
// Data persistence
function saveData() {
 localStorage.setItem('smartSpendrData', JSON.stringify({
   transactions,
   subscriptions
 }));
}
function loadData() {
 const data = JSON.parse(localStorage.getItem('smartSpendrData'));
 if (data) {
   transactions = data.transactions || [];
   subscriptions = data.subscriptions || [];
   // Update UI with loaded data
   transactions.forEach(t => addTransactionToUI(t));
   subscriptions.forEach(s => addSubscriptionToUI(s));
   updateOverviewCards();
 }
}
// Initialize
if (document.getElementById('dashboard-page').classList.contains('active')) {
 loadData();
}
