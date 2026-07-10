import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      alert("Network Error: Could not reach the server. Ensure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Create an Account</h2>
        <input 
          type="text" placeholder="Name" required
          className="w-full bg-ink-900 text-white px-4 py-3 rounded-lg border border-white/10"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
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
          Sign Up
        </button>
      </form>
    </div>
  );
}