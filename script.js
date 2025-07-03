// script.js
function showModal(id) {
  document.getElementById(id).style.display = 'block';
}

function hideModal(id) {
  document.getElementById(id).style.display = 'none';
}

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('dashboard-page').classList.add('active');
});

document.getElementById('logout-btn').addEventListener('click', function() {
  document.getElementById('dashboard-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
});
