export type ProductCategory = 
  | 'rice'
  | 'ghee_oil'
  | 'pulses_daal'
  | 'spices_masala'
  | 'flours_atta'
  | 'jaggery_sweets'
  | 'pickles_chutneys';

export interface WeightOption {
  id: string;
  weightLabel: string; // e.g. '1 kg', '5 kg', '10 kg', '25 kg'
  weightInKg: number;
  price: number;
  originalPrice?: number;
  stock: number;
  skuModifier: string;
  isPopular?: boolean;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  servingSize: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  longDescription: string;
  origin: string;
  grainLength?: string;
  aroma?: string;
  harvestSeason?: string;
  imageUrl: string;
  badge?: string; // 'Best Seller' | 'GI Tagged' | 'Aged 2 Years' | 'Direct Farm'
  tags: string[];
  unitCost: number; // Cost price for inventory valuation
  weightOptions: WeightOption[];
  rating: number;
  reviewCount: number;
  nutrition: NutritionInfo;
  cookingTips?: string;
  featured?: boolean;
}

export interface CartItem {
  id: string; // composite `${productId}-${weightOptionId}`
  productId: string;
  productName: string;
  hindiName?: string;
  weightOptionId: string;
  weightLabel: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sku: string;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'paid' | 'pending' | 'failed';
  transactionId: string;
  cardLast4?: string;
  cardBrand?: string;
  upiId?: string;
  bankName?: string;
  paidAt: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered';

export interface Order {
  id: string; // e.g. 'DB-8924'
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  taxAmount: number; // GST 5% for rice/desi food
  totalAmount: number;
  shippingAddress: ShippingAddress;
  payment: PaymentDetails;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface InventoryLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  weightLabel: string;
  changeAmount: number; // + or -
  previousStock: number;
  newStock: number;
  reason: 'order_sale' | 'restock' | 'adjustment' | 'damage_loss' | 'initial_seed';
  referenceId?: string; // Order ID or Restock Batch ID
  notes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
}
