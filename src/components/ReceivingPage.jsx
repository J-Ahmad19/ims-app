import { useState, useEffect } from 'react';

export default function ReceivingPage() {
  const [pos, setPos] = useState([]);
  
  // Data for Dropdowns
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ supplier_id: '', product_id: '', warehouse_id: '', quantity: '' });

  useEffect(() => {
    fetchPOs();
    // Fetch dropdown data
    fetch('http://localhost:5001/suppliers').then(r => r.json()).then(setSuppliers);
    fetch('http://localhost:5001/products').then(r => r.json()).then(setProducts);
    fetch('http://localhost:5001/warehouses').then(r => r.json()).then(setWarehouses);
  }, []);

  const fetchPOs = async () => {
    const res = await fetch('http://localhost:5001/purchase-orders');
    setPos(await res.json());
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5001/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchPOs();
  };

  const handleReceive = async (poId) => {
    if (!window.confirm("Confirm receiving this inventory? It will update live stock levels.")) return;
    try {
      const res = await fetch(`http://localhost:5001/purchase-orders/${poId}/receive`, { method: 'PUT' });
      if (res.ok) fetchPOs();
    } catch (err) {
      alert("Error receiving inventory");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Receiving & Purchase Orders(POs)</h1>
          <p className="text-sm text-ink-400 mt-1">Order stock and log inbound shipments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm">+ Create Purchase Order</button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase">PO #</th>
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase">Supplier</th>
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase">Item & Qty</th>
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase">Destination</th>
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pos.map((po) => (
              <tr key={po.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-indigo-300">PO-{po.id}</td>
                <td className="px-6 py-4 text-sm text-white">{po.supplier_name}</td>
                <td className="px-6 py-4 text-sm text-white">
                  {po.quantity}x <span className="text-ink-400">({po.sku})</span>
                </td>
                <td className="px-6 py-4 text-sm text-white">{po.warehouse_code}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    po.status === 'Received' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {po.status !== 'Received' ? (
                    <button onClick={() => handleReceive(po.id)} className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
                      Mark Received
                    </button>
                  ) : (
                    <span className="text-ink-500 text-sm">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Create Purchase Order</h2>
            <form onSubmit={handleCreatePO} className="space-y-4">
              <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, supplier_id: e.target.value})}>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, product_id: e.target.value})}>
                <option value="">Select Product to Order</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
              <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, warehouse_id: e.target.value})}>
                <option value="">Destination Warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
              </select>
              <input type="number" placeholder="Quantity" required min="1" className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white">Submit PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}