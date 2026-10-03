import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, WeightOption } from '../../types';
import { X, Plus, Trash2, Sparkles, Image, Check } from 'lucide-react';

interface AddEditProductModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sona Masoori', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desi Ghee', url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mustard Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Whole Atta', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pulses / Dal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Spices / Masala', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desi Jaggery', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { addProduct, updateProduct } = useStore();

  const [name, setName] = useState(productToEdit?.name || '');
  const [hindiName, setHindiName] = useState(productToEdit?.hindiName || '');
  const [sku, setSku] = useState(productToEdit?.sku || `RICE-NEW-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'rice');
  const [origin, setOrigin] = useState(productToEdit?.origin || 'Dehradun Valley, Uttarakhand');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || PRESET_IMAGES[0].url);
  const [badge, setBadge] = useState(productToEdit?.badge || 'New Crop');
  const [unitCost, setUnitCost] = useState(productToEdit?.unitCost || 85);

  const [weightOptions, setWeightOptions] = useState<WeightOption[]>(
    productToEdit?.weightOptions || [
      { id: 'w-1', weightLabel: '1 kg Bag', weightInKg: 1, price: 150, originalPrice: 180, stock: 40, skuModifier: '1K' },
      { id: 'w-2', weightLabel: '5 kg Bag', weightInKg: 5, price: 720, originalPrice: 850, stock: 15, skuModifier: '5K', isPopular: true },
      { id: 'w-3', weightLabel: '10 kg Sack', weightInKg: 10, price: 1390, originalPrice: 1650, stock: 5, skuModifier: '10K' },
    ]
  );

  const handleAddVariant = () => {
    const newId = `w-${Date.now()}`;
    setWeightOptions([
      ...weightOptions,
      {
        id: newId,
        weightLabel: '25 kg Wholesale Sack',
        weightInKg: 25,
        price: 3200,
        originalPrice: 3800,
        stock: 10,
        skuModifier: '25K',
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (weightOptions.length <= 1) return;
    setWeightOptions(weightOptions.filter((w) => w.id !== id));
  };

  const handleUpdateVariant = (id: string, field: keyof WeightOption, value: any) => {
    setWeightOptions(
      weightOptions.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryLabels: Record<ProductCategory, string> = {
      rice: 'Heritage Rice',
      ghee_oil: 'Pure Ghee & Oils',
      pulses_daal: 'Organic Daal & Pulses',
      spices_masala: 'Desi Spices & Masalas',
      flours_atta: 'Flours & Grains',
      jaggery_sweets: 'Jaggery & Natural Sweeteners',
      pickles_chutneys: 'Traditional Pickles & Chutneys',
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        hindiName,
        sku,
        category,
        categoryLabel: categoryLabels[category],
        origin,
        description,
        imageUrl,
        badge,
        unitCost,
        weightOptions,
      });
    } else {
      addProduct({
        sku,
        name,
        hindiName,
        category,
        categoryLabel: categoryLabels[category],
        description,
        longDescription: description,
        origin,
        imageUrl,
        badge,
        tags: ['Pure Desi', 'Farm Direct', 'Lab Tested'],
        unitCost,
        weightOptions,
        rating: 4.9,
        reviewCount: 1,
        nutrition: {
          calories: '350 kcal',
          protein: '8.0 g',
          carbs: '76 g',
          fat: '0.8 g',
          fiber: '2.0 g',
          servingSize: '100g',
        },
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div>
            <h3 className="font-bold text-base font-display">
              {productToEdit ? 'Edit Product & Stock Parameters' : 'Add New Desi Grain / Product'}
            </h3>
            <p className="text-[11px] text-stone-400">
              Manage inventory details, SKU, packaging variants and valuation
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Product Name (English)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal 1121 Aged Basmati"
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500 font-semibold text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Regional / Hindi Name
              </label>
              <input
                type="text"
                value={hindiName}
                onChange={(e) => setHindiName(e.target.value)}
                placeholder="e.g. शाही ११२१ बासमती चावल"
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500 font-serif"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Base SKU Prefix
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 font-mono text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="rice">Heritage Rice</option>
                <option value="ghee_oil">A2 Ghee & Oils</option>
                <option value="pulses_daal">Organic Daal & Pulses</option>
                <option value="flours_atta">Flours & Atta</option>
                <option value="spices_masala">Spices & Masalas</option>
                <option value="jaggery_sweets">Jaggery & Natural Gur</option>
                <option value="pickles_chutneys">Artisan Pickles</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Unit Cost Price (₹ / kg)
              </label>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 font-semibold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Origin / Heritage Region
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Dehradun Valley, Uttarakhand"
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Marketing Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Aged 2 Years, GI Tagged"
                className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Short Description & Quality Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
              placeholder="Describe grain length, aroma, stone-milling process..."
              required
            />
          </div>

          {/* Image Selector & Presets */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-stone-400" />
              <span>Image URL</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-stone-300 rounded-xl p-2.5 bg-stone-50 text-[11px] focus:outline-none focus:border-amber-500 mb-1.5"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-stone-400 py-1">Quick Presets:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition ${
                    imageUrl === preset.url
                      ? 'bg-amber-100 border-amber-600 font-bold text-amber-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packaging Variants & Stock Matrix */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-xs">
                  Pack Sizes, Selling Prices & Warehouse Stock
                </h4>
                <p className="text-[10px] text-stone-500">
                  Each weight option maintains independent real-time inventory counts
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1 bg-stone-900 text-white hover:bg-stone-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
              >
                <Plus className="w-3 h-3" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-2">
              {weightOptions.map((opt, index) => (
                <div
                  key={opt.id}
                  className="bg-white p-3 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                >
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-stone-400 block font-semibold">Weight Label</label>
                    <input
                      type="text"
                      value={opt.weightLabel}
                      onChange={(e) => handleUpdateVariant(opt.id, 'weightLabel', e.target.value)}
                      placeholder="e.g. 5 kg Bag"
                      className="w-full border border-stone-200 rounded-lg p-1.5 font-medium"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-stone-400 block font-semibold">SKU Mod</label>
                    <input
                      type="text"
                      value={opt.skuModifier}
                      onChange={(e) => handleUpdateVariant(opt.id, 'skuModifier', e.target.value.toUpperCase())}
                      placeholder="5K"
                      className="w-full border border-stone-200 rounded-lg p-1.5 font-mono text-center font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-stone-400 block font-semibold">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={opt.price}
                      onChange={(e) => handleUpdateVariant(opt.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full border border-stone-200 rounded-lg p-1.5 font-bold text-amber-800"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-stone-400 block font-semibold">MRP / Orig (₹)</label>
                    <input
                      type="number"
                      value={opt.originalPrice || ''}
                      onChange={(e) => handleUpdateVariant(opt.id, 'originalPrice', parseFloat(e.target.value) || 0)}
                      className="w-full border border-stone-200 rounded-lg p-1.5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-stone-400 block font-semibold">Current Stock</label>
                    <input
                      type="number"
                      value={opt.stock}
                      onChange={(e) => handleUpdateVariant(opt.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full border border-stone-200 rounded-lg p-1.5 font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(opt.id)}
                      disabled={weightOptions.length <= 1}
                      className="text-stone-400 hover:text-rose-600 disabled:opacity-20 p-1"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl shadow-md transition"
            >
              {productToEdit ? 'Save Changes' : 'Create & Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
