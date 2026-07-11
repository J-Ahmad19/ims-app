import { useState, useEffect } from 'react';

export default function StockLevelsPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStockLevels();
  }, []);

  const fetchStockLevels = async () => {
    try {
      const res = await fetch('http://localhost:5001/stock');
      const data = await res.json();
      setStock(data);
    } catch (err) {
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  // User-Centric Feature: Derive the health status dynamically
  const getStockStatus = (quantity, threshold) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-rose-500/15 text-rose-400 border-rose-500/20' };
    if (quantity <= threshold) return { label: 'Low Stock', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
    return { label: 'Healthy', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' };
  };

  // Filter based on search input
  const filteredStock = stock.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Current Stock Levels</h1>
          <p className="text-sm text-ink-400 mt-1">Monitor live inventory across your entire warehouse network.</p>
        </div>
        <div className="relative w-full sm:w-72 glass rounded-xl">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search SKU, Product, or Location..." 
            className="w-full bg-transparent text-sm text-white placeholder-ink-500 pl-10 pr-4 py-2.5 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Product & SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider text-right">Qty Available</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider text-right">Min. Threshold</th>
                <th className="px-6 py-4 text-xs font-semibold text-ink-400 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-ink-500">Loading stock data...</td></tr>
              ) : filteredStock.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-ink-500">No matching stock found.</td></tr>
              ) : (
                filteredStock.map((item) => {
                  const status = getStockStatus(item.quantity, item.low_stock_threshold);
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{item.product_name}</div>
                        <div className="text-xs font-mono text-indigo-400 mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-ink-300 border border-white/10">
                          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          {item.warehouse_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-bold ${item.quantity <= item.low_stock_threshold ? 'text-amber-400' : 'text-white'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-ink-400">
                        {item.low_stock_threshold}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}