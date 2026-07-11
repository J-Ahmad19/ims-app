import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      alert('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard/home
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full bg-ink-900 text-white px-4 py-3 rounded-lg border border-white/10"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full bg-ink-900 text-white px-4 py-3 rounded-lg border border-white/10"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all">
          Log In
        </button>
      </form>
    </div>
  );
}