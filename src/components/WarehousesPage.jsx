import { useState, useEffect } from 'react';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', location: '', capacity_percentage: 0 });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('http://localhost:5001/warehouses');
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (warehouse = null) => {
    if (warehouse) {
      setEditId(warehouse.id);
      setFormData({ 
        code: warehouse.code, 
        name: warehouse.name, 
        location: warehouse.location, 
        capacity_percentage: warehouse.capacity_percentage 
      });
    } else {
      setEditId(null);
      setFormData({ code: '', name: '', location: '', capacity_percentage: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId 
      ? `http://localhost:5001/warehouses/${editId}` 
      : 'http://localhost:5001/warehouses';
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      
      setIsModalOpen(false);
      fetchWarehouses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? Deleting this warehouse will also delete all associated stock levels!")) return;
    
    try {
      const response = await fetch(`http://localhost:5001/warehouses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete warehouse');
      
      fetchWarehouses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Warehouses</h1>
          <p className="text-sm text-ink-400 mt-1">Manage your physical network and capacity.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Location
        </button>
      </div>

      {/* Warehouses Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Facility Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider w-64">Capacity</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-ink-500">Loading warehouses...</td>
                </tr>
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-ink-500">No facilities found.</td>
                </tr>
              ) : (
                warehouses.map((wh) => (
                  <tr key={wh.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-indigo-400">{wh.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{wh.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{wh.location || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-ink-400">Usage</span>
                        <span className={`font-mono ${wh.capacity_percentage > 85 ? 'text-amber-400' : 'text-white'}`}>
                          {wh.capacity_percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-ink-800/50 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${
                            wh.capacity_percentage > 85 ? 'from-amber-500 to-rose-500' : 'from-indigo-500 to-violet-500'
                          }`}
                          style={{ width: `${wh.capacity_percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <button 
                        onClick={() => openModal(wh)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(wh.id)}
                        className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Glassmorphism Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
              {editId ? 'Edit Warehouse' : 'Add New Warehouse'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Code</label>
                  <input 
                    type="text" required maxLength="10"
                    placeholder="e.g. NYC"
                    className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none transition-all uppercase"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Capacity (%)</label>
                  <input 
                    type="number" required min="0" max="100" step="0.1"
                    className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                    value={formData.capacity_percentage}
                    onChange={(e) => setFormData({...formData, capacity_percentage: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Facility Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Manhattan Central"
                  className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Location / Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. New York, NY"
                  className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
                >
                  {editId ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}