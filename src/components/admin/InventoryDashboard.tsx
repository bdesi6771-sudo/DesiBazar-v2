import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, WeightOption, OrderStatus } from '../../types';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Plus, 
  Download, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  PackagePlus, 
  History, 
  Truck, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { RestockModal } from './RestockModal';
import { AddEditProductModal } from './AddEditProductModal';

export const InventoryDashboard: React.FC = () => {
  const {
    products,
    orders,
    inventoryLogs,
    adjustStock,
    deleteProduct,
    resetToSeedData,
    lowStockCount,
    outOfStockCount,
    totalInventoryValuation,
    updateOrderStatus,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'audit_logs' | 'orders'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  // Modal states
  const [restockTarget, setRestockTarget] = useState<{ product: Product; variant: WeightOption } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Financial aggregates
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSoldUnits = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  // Flattened inventory variants for deep SKU table
  const inventoryRows: {
    product: Product;
    variant: WeightOption;
    fullSku: string;
    marginPercent: number;
    status: 'out_of_stock' | 'low_stock' | 'healthy';
  }[] = [];

  for (const prod of products) {
    for (const v of prod.weightOptions) {
      const fullSku = `${prod.sku}-${v.skuModifier}`;
      const approxCost = Math.round(prod.unitCost * (v.weightInKg || 1));
      const margin = v.price > 0 ? Math.round(((v.price - approxCost) / v.price) * 100) : 0;
      const status = v.stock === 0 ? 'out_of_stock' : v.stock <= 10 ? 'low_stock' : 'healthy';

      // Filters
      if (categoryFilter !== 'all' && prod.category !== categoryFilter) continue;
      if (stockStatusFilter === 'low' && status !== 'low_stock') continue;
      if (stockStatusFilter === 'out' && status !== 'out_of_stock') continue;
      if (stockStatusFilter === 'healthy' && status !== 'healthy') continue;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesSku = fullSku.toLowerCase().includes(query);
        const matchesOrigin = prod.origin.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesOrigin) continue;
      }

      inventoryRows.push({
        product: prod,
        variant: v,
        fullSku,
        marginPercent: margin,
        status,
      });
    }
  }

  // Export inventory CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Pack Size', 'Stock Count', 'Selling Price (INR)', 'Unit Cost (INR)', 'Margin %', 'Status'];
    const rows = inventoryRows.map((r) => [
      r.fullSku,
      `"${r.product.name}"`,
      r.product.categoryLabel,
      r.variant.weightLabel,
      r.variant.stock,
      r.variant.price,
      r.product.unitCost,
      `${r.marginPercent}%`,
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DesiBazaar_Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-16">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-stone-950 font-bold text-xs uppercase px-2.5 py-0.5 rounded">
                  Admin Portal
                </span>
                <span className="text-stone-400 text-xs">
                  Real-time Warehouse & Silo Inventory System
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                Grain Stock & Inventory Command Center
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('store')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-semibold border border-stone-700 transition"
              >
                ← Return to Storefront
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* KPI Executive Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-stone-800">
            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                Total Stock Value
              </span>
              <p className="text-lg font-bold text-amber-400 font-display mt-0.5">
                ₹{totalInventoryValuation.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500">Warehouse valuation</span>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                Active SKUs
              </span>
              <p className="text-lg font-bold text-white font-display mt-0.5">
                {products.reduce((acc, p) => acc + p.weightOptions.length, 0)}
              </p>
              <span className="text-[10px] text-stone-500">Across {products.length} products</span>
            </div>

            <div className={`p-3.5 rounded-2xl border transition ${
              lowStockCount > 0 ? 'bg-amber-950/40 border-amber-500/50' : 'bg-stone-800/80 border-stone-700/70'
            }`}>
              <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Low Stock Alert</span>
              </span>
              <p className="text-lg font-bold text-amber-300 font-display mt-0.5">
                {lowStockCount} SKUs
              </p>
              <span className="text-[10px] text-stone-400">Stock ≤ 10 bags</span>
            </div>

            <div className={`p-3.5 rounded-2xl border transition ${
              outOfStockCount > 0 ? 'bg-rose-950/40 border-rose-500/50' : 'bg-stone-800/80 border-stone-700/70'
            }`}>
              <span className="text-[10px] text-rose-400 uppercase font-bold block">
                Out of Stock
              </span>
              <p className="text-lg font-bold text-rose-300 font-display mt-0.5">
                {outOfStockCount} SKUs
              </p>
              <span className="text-[10px] text-stone-400">Needs restock</span>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                Orders Fulfilled
              </span>
              <p className="text-lg font-bold text-white font-display mt-0.5">
                {orders.length}
              </p>
              <span className="text-[10px] text-stone-500">{totalSoldUnits} bags dispatched</span>
            </div>

            <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700/70">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                Gross Revenue
              </span>
              <p className="text-lg font-bold text-emerald-400 font-display mt-0.5">
                ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-[10px] text-stone-500">Live store sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Tab Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'inventory'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Inventory & Stock ({inventoryRows.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'audit_logs'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <History className="w-4 h-4 text-amber-500" />
              <span>Stock Ledger & Audit Trail ({inventoryLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Orders & Dispatch ({orders.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition"
              title="Download full inventory CSV report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset catalog and demo stock to original values?')) {
                  resetToSeedData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold shadow-xs transition"
              title="Reset inventory to default demo seeds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INVENTORY & STOCK TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by SKU (e.g. RICE-BASM), product name, or origin..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Category select */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="border border-stone-200 rounded-xl p-2 bg-stone-50 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Categories</option>
                  <option value="rice">Heritage Rice</option>
                  <option value="ghee_oil">Ghee & Oils</option>
                  <option value="pulses_daal">Organic Dals</option>
                  <option value="flours_atta">Flours & Atta</option>
                  <option value="spices_masala">Spices & Masalas</option>
                  <option value="jaggery_sweets">Desi Jaggery</option>
                  <option value="pickles_chutneys">Pickles</option>
                </select>

                {/* Stock status filter */}
                <select
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value as any)}
                  className="border border-stone-200 rounded-xl p-2 bg-stone-50 font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="low">⚠️ Low Stock (≤ 10)</option>
                  <option value="out">🛑 Out of Stock (0)</option>
                  <option value="healthy">✅ Healthy (&gt; 10)</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Item & Full SKU</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Pack Variant</th>
                      <th className="py-3 px-3">Cost Price</th>
                      <th className="py-3 px-3">Selling Price</th>
                      <th className="py-3 px-3">Gross Margin</th>
                      <th className="py-3 px-4">Warehouse Stock Level</th>
                      <th className="py-3 px-3 text-center">Quick Adjust</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inventoryRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-stone-500">
                          No inventory items match the current filters.
                        </td>
                      </tr>
                    ) : (
                      inventoryRows.map((row) => (
                        <tr
                          key={`${row.product.id}-${row.variant.id}`}
                          className="hover:bg-amber-50/40 transition group"
                        >
                          {/* Item & SKU */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={row.product.imageUrl}
                                alt={row.product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
                                  {row.product.name}
                                </h4>
                                <span className="font-mono text-[10px] text-stone-500 font-bold bg-stone-100 px-1 rounded">
                                  {row.fullSku}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                              {row.product.categoryLabel}
                            </span>
                          </td>

                          {/* Pack Variant */}
                          <td className="py-3 px-3 font-semibold text-stone-900">
                            {row.variant.weightLabel}
                          </td>

                          {/* Cost Price */}
                          <td className="py-3 px-3 font-mono text-stone-500">
                            ₹{row.product.unitCost} /kg
                          </td>

                          {/* Selling Price */}
                          <td className="py-3 px-3 font-bold text-stone-900">
                            ₹{row.variant.price}
                          </td>

                          {/* Gross Margin */}
                          <td className="py-3 px-3">
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                              {row.marginPercent}%
                            </span>
                          </td>

                          {/* Warehouse Stock Level with status badge */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-stone-900 font-display">
                                  {row.variant.stock} bags
                                </span>
                                {row.status === 'out_of_stock' ? (
                                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    Out of stock
                                  </span>
                                ) : row.status === 'low_stock' ? (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    Low stock
                                  </span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    In Stock
                                  </span>
                                )}
                              </div>
                              <div className="w-28 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    row.status === 'out_of_stock'
                                      ? 'bg-rose-500 w-0'
                                      : row.status === 'low_stock'
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-600'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, (row.variant.stock / 50) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Quick Adjust Buttons */}
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() =>
                                  adjustStock(
                                    row.product.id,
                                    row.variant.id,
                                    -1,
                                    'adjustment',
                                    'Quick manual decrement (-1)'
                                  )
                                }
                                disabled={row.variant.stock <= 0}
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 font-bold flex items-center justify-center disabled:opacity-30"
                                title="Subtract 1 unit"
                              >
                                -1
                              </button>
                              <button
                                onClick={() =>
                                  adjustStock(
                                    row.product.id,
                                    row.variant.id,
                                    1,
                                    'adjustment',
                                    'Quick manual increment (+1)'
                                  )
                                }
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 font-bold flex items-center justify-center"
                                title="Add 1 unit"
                              >
                                +1
                              </button>
                              <button
                                onClick={() =>
                                  adjustStock(
                                    row.product.id,
                                    row.variant.id,
                                    5,
                                    'adjustment',
                                    'Quick manual increment (+5)'
                                  )
                                }
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 font-bold flex items-center justify-center text-[10px]"
                                title="Add 5 units"
                              >
                                +5
                              </button>
                              <button
                                onClick={() =>
                                  adjustStock(
                                    row.product.id,
                                    row.variant.id,
                                    25,
                                    'adjustment',
                                    'Bulk restock increment (+25)'
                                  )
                                }
                                className="px-1.5 h-6 rounded bg-stone-100 hover:bg-amber-100 text-stone-800 font-bold flex items-center justify-center text-[10px]"
                                title="Add 25 units"
                              >
                                +25
                              </button>
                            </div>
                          </td>

                          {/* Actions: Batch Restock, Edit, Delete */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  setRestockTarget({
                                    product: row.product,
                                    variant: row.variant,
                                  })
                                }
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1 transition"
                                title="Batch intake with supplier invoice"
                              >
                                <PackagePlus className="w-3.5 h-3.5" />
                                <span>Restock</span>
                              </button>

                              <button
                                onClick={() => setEditingProduct(row.product)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                                title="Edit product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete product ${row.product.name} from catalog?`)) {
                                    deleteProduct(row.product.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS & INVENTORY LEDGER */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Complete Inventory Audit Trail & Historical Ledger
                </h3>
                <p className="text-xs text-stone-500">
                  Every stock decrement from customer orders and inward shipment restock is immutably logged with timestamps.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                {inventoryLogs.length} Total Ledger Events
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Item & Variant</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3">Event Type</th>
                      <th className="py-3 px-3 text-center">Change</th>
                      <th className="py-3 px-3">Stock Balance</th>
                      <th className="py-3 px-4">Audit Notes & Reference ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inventoryLogs.map((log) => {
                      const isPositive = log.changeAmount > 0;
                      return (
                        <tr key={log.id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'medium',
                            })}
                          </td>

                          <td className="py-3 px-4">
                            <h5 className="font-bold text-stone-900">{log.productName}</h5>
                            <span className="text-stone-500 text-[11px]">{log.weightLabel}</span>
                          </td>

                          <td className="py-3 px-3 font-mono text-stone-600 font-bold text-[11px]">
                            {log.sku}
                          </td>

                          <td className="py-3 px-3">
                            {log.reason === 'order_sale' ? (
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Customer Sale
                              </span>
                            ) : log.reason === 'restock' ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Inward Restock
                              </span>
                            ) : (
                              <span className="bg-stone-100 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                Manual Adjustment
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`font-mono font-bold text-xs px-2 py-0.5 rounded inline-flex items-center gap-0.5 ${
                                isPositive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              <span>{isPositive ? `+${log.changeAmount}` : log.changeAmount}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono text-xs">
                            <span className="text-stone-400">{log.previousStock}</span>
                            <span className="text-stone-300 mx-1">→</span>
                            <span className="font-bold text-stone-900">{log.newStock} bags</span>
                          </td>

                          <td className="py-3 px-4 text-stone-600 text-[11px]">
                            <p>{log.notes}</p>
                            {log.referenceId && (
                              <span className="font-mono text-[10px] text-amber-800 font-semibold">
                                Ref: #{log.referenceId}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS & DISPATCH DESK */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Customer Orders & Warehouse Dispatch Desk
                </h3>
                <p className="text-xs text-stone-500">
                  Update fulfillment status and view item packing slips
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                {orders.length} Total Orders Received
              </span>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-stone-900">
                        #{order.id}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                        Paid via {order.payment.method} ({order.payment.transactionId})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-stone-500">
                        Fulfillment Status:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="border border-stone-300 rounded-xl px-3 py-1 text-xs font-bold bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="placed">Order Placed</option>
                        <option value="confirmed">Confirmed & Allocated</option>
                        <option value="packed">Packed in Silo Pouch</option>
                        <option value="shipped">Shipped with Courier</option>
                        <option value="delivered">Delivered to Customer</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Customer */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                      <span className="font-bold text-stone-700 block text-[10px] uppercase">
                        Recipient Address
                      </span>
                      <p className="font-bold text-stone-900">{order.shippingAddress.fullName}</p>
                      <p className="text-stone-600">{order.shippingAddress.streetAddress}</p>
                      <p className="text-stone-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                      </p>
                      <p className="text-stone-500 font-mono">Ph: {order.shippingAddress.phone}</p>
                    </div>

                    {/* Items */}
                    <div className="md:col-span-2 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                      <span className="font-bold text-stone-700 block text-[10px] uppercase">
                        Grain Items Packed ({order.items.length})
                      </span>
                      <div className="space-y-1.5">
                        {order.items.map((i) => (
                          <div key={i.id} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-stone-800">
                              {i.quantity} × {i.productName} ({i.weightLabel})
                            </span>
                            <span className="font-mono text-stone-600">
                              ₹{i.price * i.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900 text-xs">
                        <span>Total Paid (inc. GST & Delivery)</span>
                        <span className="text-amber-800 text-sm font-display">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      {restockTarget && (
        <RestockModal
          product={restockTarget.product}
          variant={restockTarget.variant}
          onClose={() => setRestockTarget(null)}
        />
      )}

      {(isAddModalOpen || editingProduct) && (
        <AddEditProductModal
          productToEdit={editingProduct}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
