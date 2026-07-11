import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null means we are adding, an ID means we are editing
  const [formData, setFormData] = useState({ sku: '', name: '', price: '' });

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Modal for Add or Edit
  const openModal = (product = null) => {
    if (product) {
      setEditId(product.id);
      setFormData({ sku: product.sku, name: product.name, price: product.price });
    } else {
      setEditId(null);
      setFormData({ sku: '', name: '', price: '' });
    }
    setIsModalOpen(true);
  };

  // Handle Form Submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId 
      ? `http://localhost:5001/products/${editId}` 
      : 'http://localhost:5001/products';
    
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
      fetchProducts(); // Refresh table
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`http://localhost:5001/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts(); // Refresh table
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products & SKUs</h1>
          <p className="text-sm text-ink-400 mt-1">Manage your inventory catalog.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-ink-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-ink-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-indigo-300">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <button 
                        onClick={() => openModal(product)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
              {editId ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">SKU</label>
                <input 
                  type="text" required
                  placeholder="e.g. WH-APP-001"
                  className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Wireless Headphones"
                  className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1.5 uppercase tracking-wider">Price ($)</label>
                <input 
                  type="number" required step="0.01" min="0"
                  placeholder="0.00"
                  className="w-full bg-ink-900/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                  {editId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}