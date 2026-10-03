import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, WeightOption } from '../../types';
import { X, PackagePlus, Building, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RestockModalProps {
  product: Product;
  variant: WeightOption;
  onClose: () => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  product,
  variant,
  onClose,
}) => {
  const { batchRestock } = useStore();

  const [addedUnits, setAddedUnits] = useState(25);
  const [supplier, setSupplier] = useState('Dehradun Heritage Rice Silos Ltd.');
  const [invoiceNo, setInvoiceNo] = useState(`INV-RC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [updatedCost, setUpdatedCost] = useState(product.unitCost);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addedUnits <= 0) return;

    batchRestock(
      product.id,
      variant.id,
      addedUnits,
      supplier,
      invoiceNo,
      updatedCost
    );

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <PackagePlus className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base font-display">
                Batch Restock & Inward Receipt
              </h3>
              <p className="text-[11px] text-stone-400">
                Log intake of fresh harvest stock into warehouse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">
              Inventory Successfully Restocked!
            </h4>
            <p className="text-xs text-stone-600">
              Added <strong>+{addedUnits} units</strong> of {product.name} ({variant.weightLabel}). Audit log recorded under #{invoiceNo}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Target Item summary */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-stone-400 block">
                  TARGET SKU: {product.sku}-{variant.skuModifier}
                </span>
                <h4 className="font-bold text-stone-900 text-sm">
                  {product.name}
                </h4>
                <p className="text-stone-500 font-medium">
                  Pack: <span className="text-amber-800 font-semibold">{variant.weightLabel}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Current Stock</span>
                <span className="text-base font-bold text-stone-900 font-display">
                  {variant.stock} bags
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Units Received (+ Bags / Packs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={addedUnits}
                  onChange={(e) => setAddedUnits(parseInt(e.target.value) || 0)}
                  className="flex-1 border border-stone-300 rounded-xl p-2.5 bg-stone-50 text-stone-900 font-bold text-sm focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex gap-1.5">
                  {[10, 25, 50, 100].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setAddedUnits(quick)}
                      className="px-2.5 py-2 rounded-lg border border-stone-200 bg-stone-100 hover:bg-amber-100 text-stone-700 font-semibold text-[11px]"
                    >
                      +{quick}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                New Stock will be: <strong>{variant.stock + addedUnits} bags</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-stone-400" />
                  <span>Supplier / Mill / Mandi</span>
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Karnal Mandi Rice Mill"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Inward Invoice / GRN No.</span>
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 font-mono focus:outline-none focus:border-amber-500"
                  placeholder="e.g. INV-9842"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Unit Cost Price per kg (₹ for inventory valuation)
              </label>
              <input
                type="number"
                min="1"
                value={updatedCost}
                onChange={(e) => setUpdatedCost(parseFloat(e.target.value) || 0)}
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition"
              >
                Confirm Restock (+{addedUnits} Units)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
