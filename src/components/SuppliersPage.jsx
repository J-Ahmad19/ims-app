import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_email: '', phone: '', lead_time_days: '' });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    const res = await fetch('http://localhost:5001/suppliers');
    setSuppliers(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5001/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchSuppliers();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Suppliers</h1>
          <p className="text-sm text-ink-400 mt-1">Manage your vendor relationships.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg">+ Add Supplier</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(sup => (
          <div key={sup.id} className="glass p-5 rounded-2xl space-y-3 border border-white/5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">{sup.name}</h3>
              <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg font-medium">★ {sup.rating}</span>
            </div>
            <div className="text-sm text-ink-400 space-y-1">
              <p>📧 {sup.contact_email}</p>
              <p>📱 {sup.phone}</p>
              <p>⏱️ Lead Time: {sup.lead_time_days} days</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Add Supplier</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Company Name" required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, contact_email: e.target.value})} />
              <input type="text" placeholder="Phone" className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="number" placeholder="Lead Time (Days)" className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, lead_time_days: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}