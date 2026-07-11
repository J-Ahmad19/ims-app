import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Data for the Manual Order Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    warehouse_id: '',
    quantity: 1,
    unit_price: 0
  });

  useEffect(() => {
    fetchOrders();
    // Fetch dropdown data for the modal
    fetch('http://localhost:5001/customers').then(r => r.json()).then(setCustomers);
    fetch('http://localhost:5001/products').then(r => r.json()).then(setProducts);
    fetch('http://localhost:5001/warehouses').then(r => r.json()).then(setWarehouses);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/orders');
      setOrders(await res.json());
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Product Selection to auto-fill the price
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
    
    setFormData({
      ...formData,
      product_id: selectedProductId,
      unit_price: selectedProduct ? selectedProduct.price : 0
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    // Format the payload exactly how our backend transaction expects it
    const payload = {
      customer_id: formData.customer_id,
      items: [
        {
          product_id: formData.product_id,
          warehouse_id: formData.warehouse_id,
          quantity: parseInt(formData.quantity),
          unit_price: parseFloat(formData.unit_price)
        }
      ]
    };

    try {
      const res = await fetch('http://localhost:5001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      
      alert("Order created successfully! Stock has been deducted.");
      setIsModalOpen(false);
      
      // Reset form
      setFormData({ customer_id: '', product_id: '', warehouse_id: '', quantity: 1, unit_price: 0 });
      fetchOrders();
    } catch (err) {
      alert(err.message); // This will show our "Insufficient stock" error if they try to buy too much!
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-sm text-ink-400 mt-1">Track fulfillment and manually log B2B sales.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          + Manual Order Entry
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-ink-500">Loading orders...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-indigo-300">#{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{order.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-ink-300">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                      {order.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL ORDER ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Log Manual Sale</h2>
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Customer</label>
                <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})}>
                  <option value="">Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Item Sold</label>
                <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" value={formData.product_id} onChange={handleProductChange}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Fulfill From Warehouse</label>
                <select required className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" value={formData.warehouse_id} onChange={e => setFormData({...formData, warehouse_id: e.target.value})}>
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} - {w.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Qty</label>
                  <input type="number" required min="1" className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Total ($)</label>
                  <input type="text" readOnly className="w-full bg-ink-900/50 text-ink-400 px-4 py-2.5 rounded-xl border border-white/10 cursor-not-allowed" value={(formData.quantity * formData.unit_price).toFixed(2)} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30">Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}