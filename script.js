// --- Initial Setup ---
let transactions = [];
let subscriptions = [];
let currentUser = null;

const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// --- Modal and Page Visibility ---
function showModal(id) {
  document.getElementById(id).classList.add('active');
}
function hideModal(id) {
  document.getElementById(id).classList.remove('active');
}

// --- Theme Management ---
function updateThemeToggleButton() {
  if (body.classList.contains('dark-mode')) {
    themeText.textContent = 'Dark';
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
  } else {
    themeText.textContent = 'Light';
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;
  }
}

function applyInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }
  updateThemeToggleButton();
}

themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateThemeToggleButton();
});

// --- User Authentication ---
function getUsers() { return JSON.parse(localStorage.getItem('users')) || []; }
function saveUser(email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    alert("User already exists!");
    return false;
  }
  users.push({ email, password });
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (saveUser(email, password)) {
    alert("Account created. You can now login.");
    hideModal('signup-modal');
  }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const users = getUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (found) {
    currentUser = email;
    sessionStorage.setItem('currentUser', email);
    document.getElementById('user-name').textContent = `Hi, ${email.split('@')[0]}`;
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('dashboard-page').classList.add('active');
    loadData();
  } else {
    alert("Invalid email or password");
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  document.getElementById('dashboard-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
  document.getElementById('login-form').reset();
});

// --- Settings and Forgot Password ---
document.getElementById('settings-btn').addEventListener('click', () => showModal('settings-modal'));

document.getElementById('forgot-password-btn').addEventListener('click', () => {
  hideModal('settings-modal');
  showModal('forgot-password-modal');
});

document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    alert(`A password reset link has been sent to ${email} (demo).`);
    hideModal('forgot-password-modal');
});

// --- Form Submissions (Transactions & Subscriptions) ---
document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const transaction = {
    id: Date.now().toString(),
    type: this.elements.type.value,
    description: this.elements['transaction-desc'].value,
    amount: parseFloat(this.elements['transaction-amount'].value),
    category: this.elements['transaction-category'].value,
    date: new Date().toISOString()
  };
  transactions.push(transaction);
  renderTransactions();
  updateOverviewCards();
  saveData();
  this.reset();
  hideModal('transaction-modal');
});

document.getElementById('subscription-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const subscription = {
    id: Date.now().toString(),
    name: this.elements['subscription-name'].value,
    amount: parseFloat(this.elements['subscription-amount'].value),
    category: this.elements['subscription-category'].value,
    renewalDate: this.elements['subscription-renewal'].value,
    date: new Date().toISOString()
  };
  subscriptions.push(subscription);
  renderSubscriptions();
  updateOverviewCards();
  updateRenewalsList();
  updateNotifications();
  saveData();
  this.reset();
  hideModal('subscription-modal');
});

// --- UI Rendering ---
function renderUIList(listId, seeMoreBtnId, items, renderItemFunc, emptyText) {
    const listEl = document.getElementById(listId);
    const seeMoreBtn = document.getElementById(seeMoreBtnId);

    listEl.innerHTML = '';
    if (items.length === 0) {
        listEl.innerHTML = `<p class="empty-state">${emptyText}</p>`;
    } else {
        items.forEach(item => listEl.appendChild(renderItemFunc(item)));
    }

    const isCollapsed = listEl.classList.contains('collapsed');
    if (items.length > 3) {
        seeMoreBtn.style.display = 'block';
        seeMoreBtn.textContent = isCollapsed ? 'See More' : 'Show Less';
    } else {
        seeMoreBtn.style.display = 'none';
    }
}

function createTransactionItem(transaction) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.innerHTML = `
        <div class="transaction-info">
            <h4>${transaction.description}</h4>
            <p>${transaction.category} &bull; ${new Date(transaction.date).toLocaleDateString()}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}₱${transaction.amount.toFixed(2)}
            </div>
            <button class="delete-btn icon-btn" onclick="deleteTransaction('${transaction.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
        </div>`;
    return item;
}

function createSubscriptionItem(subscription) {
    const item = document.createElement('div');
    item.className = 'subscription-item';
    item.innerHTML = `
        <div class="subscription-info">
            <h4>${subscription.name}</h4>
            <p>Renews on ${new Date(subscription.renewalDate).toLocaleDateString()}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="transaction-amount">₱${subscription.amount.toFixed(2)}/mo</div>
            <button class="delete-btn icon-btn" onclick="deleteSubscription('${subscription.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
        </div>`;
    return item;
}

function renderTransactions() {
    renderUIList('transactions-list', 'see-more-transactions', transactions, createTransactionItem, 'No transactions yet.');
}
function renderSubscriptions() {
    renderUIList('subscriptions-list', 'see-more-subscriptions', subscriptions, createSubscriptionItem, 'No subscriptions yet.');
}

window.deleteTransaction = (id) => {
  if (confirm("Delete this transaction?")) {
    transactions = transactions.filter(t => t.id !== id);
    renderTransactions();
    updateOverviewCards();
    saveData();
  }
}
window.deleteSubscription = (id) => {
  if (confirm("Delete this subscription?")) {
    subscriptions = subscriptions.filter(s => s.id !== id);
    renderSubscriptions();
    updateOverviewCards();
    updateRenewalsList();
    updateNotifications();
    saveData();
  }
}

// --- Dashboard Updates ---
function updateOverviewCards() {
  const currentMonth = new Date().getMonth();
  const balance = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  document.getElementById('current-month').textContent = `₱${balance.toFixed(2)}`;
  document.getElementById('active-subs').textContent = subscriptions.length;
}

function updateRenewalsList() {
  const list = document.getElementById('renewals-list');
  list.innerHTML = '';
  if (subscriptions.length === 0) {
    list.innerHTML = '<p class="empty-state">No upcoming renewals</p>';
    return;
  }
  const sorted = [...subscriptions].sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
  sorted.forEach(sub => {
    const div = document.createElement('div');
    div.className = 'renewal-item';
    div.innerHTML = `<div class="renewal-name">${sub.name}</div><div class="renewal-details"><div class="renewal-amount">₱${sub.amount.toFixed(2)}</div><div class="renewal-date">${new Date(sub.renewalDate).toLocaleDateString()}</div></div>`;
    list.appendChild(div);
  });
}

function updateNotifications() {
  const now = new Date();
  const soon = subscriptions.filter(sub => {
    const renewal = new Date(sub.renewalDate);
    const daysLeft = (renewal - now) / (1000 * 60 * 60 * 24);
    return daysLeft >= 0 && daysLeft <= 3;
  });
  document.getElementById('notifications').textContent = soon.length;
}

// --- "See More" Logic ---
document.getElementById('see-more-transactions').addEventListener('click', function() {
  document.getElementById('transactions-list').classList.toggle('collapsed');
  this.textContent = this.textContent === 'See More' ? 'Show Less' : 'See More';
});
document.getElementById('see-more-subscriptions').addEventListener('click', function() {
  document.getElementById('subscriptions-list').classList.toggle('collapsed');
  this.textContent = this.textContent === 'See More' ? 'Show Less' : 'See More';
});

// --- Data Persistence ---
function saveData() {
  if (!currentUser) return;
  localStorage.setItem(`data-${currentUser}`, JSON.stringify({ transactions, subscriptions }));
}

function loadData() {
  if (!currentUser) return;
  const data = JSON.parse(localStorage.getItem(`data-${currentUser}`)) || { transactions: [], subscriptions: [] };
  transactions = data.transactions;
  subscriptions = data.subscriptions;
  
  document.getElementById('transactions-list').classList.add('collapsed');
  document.getElementById('subscriptions-list').classList.add('collapsed');

  renderTransactions();
  renderSubscriptions();
  updateOverviewCards();
  updateRenewalsList();
  updateNotifications();
}

// --- Initial Load ---
function checkLoginState() {
    const loggedInUser = sessionStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = loggedInUser;
        document.getElementById('user-name').textContent = `Hi, ${loggedInUser.split('@')[0]}`;
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');
        loadData();
    }
}

applyInitialTheme();
checkLoginState();
