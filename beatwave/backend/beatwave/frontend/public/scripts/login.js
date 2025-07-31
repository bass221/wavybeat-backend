const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // ✅ Use your deployed backend URL
  const API_BASE = 'https://wavybeat-backend.onrender.com';

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'index.html'; // or redirect to dashboard
    } else {
      alert(data.message || 'Login failed');
    }

  } catch (err) {
    console.error('❌ Login request failed:', err);
    alert('Network error. Please try again.');
  }
});
