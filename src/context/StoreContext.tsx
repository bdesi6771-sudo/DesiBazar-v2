import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  WeightOption,
  CartItem,
  Order,
  OrderStatus,
  InventoryLog,
  Coupon,
  ShippingAddress,
  PaymentDetails,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/seedProducts';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  appliedCoupon: Coupon | null;
  currentView: 'store' | 'admin';
  activeCategory: ProductCategory | 'all';
  searchQuery: string;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackingOpen: boolean;
  activeOrderSuccess: Order | null;
  
  // Navigation & UI controls
  setCurrentView: (view: 'store' | 'admin') => void;
  setActiveCategory: (cat: ProductCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  setActiveOrderSuccess: (order: Order | null) => void;

  // Cart actions
  addToCart: (product: Product, weightOption: WeightOption, quantity: number) => { success: boolean; message: string };
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalDiscount: number;
  cartShippingFee: number;
  cartTaxAmount: number;
  cartFinalTotal: number;
  totalCartItemCount: number;

  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Checkout & Orders
  processCheckout: (
    shippingAddress: ShippingAddress,
    paymentDetails: PaymentDetails
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Inventory Management
  adjustStock: (
    productId: string,
    weightOptionId: string,
    changeAmount: number,
    reason: InventoryLog['reason'],
    notes?: string
  ) => void;
  batchRestock: (
    productId: string,
    weightOptionId: string,
    addedUnits: number,
    supplier: string,
    invoiceNo: string,
    updatedCost?: number
  ) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetToSeedData: () => void;

  // Quick stats
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValuation: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'desibazaar_products_v1',
  CART: 'desibazaar_cart_v1',
  ORDERS: 'desibazaar_orders_v1',
  LOGS: 'desibazaar_logs_v1',
};

const INITIAL_LOGS: InventoryLog[] = [
  {
    id: 'log-init-1',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    productId: 'prod-basmati-1121',
    productName: 'Royal 1121 XXL Aged Basmati Rice',
    sku: 'RICE-BASM-1121-5K',
    weightLabel: '5 kg Bag',
    changeAmount: 50,
    previousStock: 0,
    newStock: 50,
    reason: 'restock',
    referenceId: 'INTAKE-B091',
    notes: 'Direct farm intake from Dehradun millers cellar batch #24',
  },
  {
    id: 'log-init-2',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    productId: 'prod-a2-bilona-ghee',
    productName: 'Vedic Gir Cow A2 Cultured Bilona Ghee',
    sku: 'GHEE-A2-BILONA-1L',
    weightLabel: '1 Litre Glass Jar',
    changeAmount: 25,
    previousStock: 0,
    newStock: 25,
    reason: 'restock',
    referenceId: 'INTAKE-GIR-44',
    notes: 'Junagadh gaushala seasonal harvest batch with lab certificate',
  },
  {
    id: 'log-init-3',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    productId: 'prod-sharbati-atta',
    productName: 'Chakki Fresh Sharbati Whole Wheat Atta',
    sku: 'ATTA-SHARBATI-01-5K',
    weightLabel: '5 kg Bag',
    changeAmount: 60,
    previousStock: 0,
    newStock: 60,
    reason: 'restock',
    referenceId: 'INTAKE-MP-88',
    notes: 'Sehore wheat milling batch cold ground emery stones',
  },
];

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'DB-8924',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    items: [
      {
        id: 'prod-basmati-1121-w-2',
        productId: 'prod-basmati-1121',
        productName: 'Royal 1121 XXL Aged Basmati Rice',
        hindiName: 'शाही 1121 बासमती चावल (२ वर्ष पुराना)',
        weightOptionId: 'w-2',
        weightLabel: '5 kg Bag',
        price: 875,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        sku: 'RICE-BASM-1121-5K',
        maxStock: 12,
      },
      {
        id: 'prod-a2-bilona-ghee-w-1',
        productId: 'prod-a2-bilona-ghee',
        productName: 'Vedic Gir Cow A2 Cultured Bilona Ghee',
        hindiName: 'शुद्ध वैदिक गिर गाय ए२ बिलोना घी',
        weightOptionId: 'w-1',
        weightLabel: '500 ml Glass Jar',
        price: 950,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=80',
        sku: 'GHEE-A2-BILONA-500ML',
        maxStock: 22,
      }
    ],
    subtotal: 1825,
    discount: 150,
    couponCode: 'BASMATI50',
    shippingFee: 0,
    taxAmount: 83.75,
    totalAmount: 1758.75,
    shippingAddress: {
      fullName: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 98765 43210',
      streetAddress: 'Flat 402, Lotus Grandeur, Road No. 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500033',
      country: 'India',
    },
    payment: {
      method: 'card',
      status: 'paid',
      transactionId: 'TXN-DB-98418902',
      cardLast4: '4242',
      cardBrand: 'Visa',
      paidAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    },
    status: 'shipped',
    trackingNumber: 'DELHIVERY-774928103',
    estimatedDelivery: new Date(Date.now() + 86400000 * 1).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    statusHistory: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        note: 'Order confirmed and paid via Visa Card **** 4242'
      },
      {
        status: 'packed',
        timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
        note: 'Double-vacuum boxed and safety bubble sealed'
      },
      {
        status: 'shipped',
        timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
        note: 'Handed over to Delhivery Express courier. In transit.'
      }
    ]
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      return stored ? JSON.parse(stored) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeOrderSuccess, setActiveOrderSuccess] = useState<Order | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  // Calculations for Cart
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartTotalDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      cartTotalDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      cartTotalDiscount = appliedCoupon.discountValue;
    }
  }

  // Free shipping above 800 or with FREESHIP coupon
  const cartShippingFee = cartSubtotal === 0 || cartSubtotal >= 800 || appliedCoupon?.code === 'FREESHIP' ? 0 : 79;
  
  // 5% standard GST on agricultural grains/ghee
  const taxableSubtotal = Math.max(0, cartSubtotal - cartTotalDiscount);
  const cartTaxAmount = Math.round(taxableSubtotal * 0.05 * 100) / 100;
  const cartFinalTotal = Math.max(0, taxableSubtotal + cartShippingFee + cartTaxAmount);

  const totalCartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart actions
  const addToCart = (product: Product, weightOption: WeightOption, quantity: number) => {
    // Current stock check
    const currentStock = weightOption.stock;
    const cartItemId = `${product.id}-${weightOption.id}`;
    const existingCartItem = cart.find((i) => i.id === cartItemId);
    const existingQty = existingCartItem ? existingCartItem.quantity : 0;

    if (existingQty + quantity > currentStock) {
      return {
        success: false,
        message: `Only ${currentStock} bags available in stock for ${weightOption.weightLabel}.`,
      };
    }

    setCart((prev) => {
      if (existingCartItem) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          hindiName: product.hindiName,
          weightOptionId: weightOption.id,
          weightLabel: weightOption.weightLabel,
          price: weightOption.price,
          quantity,
          imageUrl: product.imageUrl,
          sku: `${product.sku}-${weightOption.skuModifier}`,
          maxStock: currentStock,
        },
      ];
    });

    return {
      success: true,
      message: `Added ${quantity} × ${product.name} (${weightOption.weightLabel}) to your cart.`,
    };
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const qty = Math.min(newQuantity, item.maxStock);
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try DESI10 or BASMATI50.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order amount of ₹${found.minOrder} required for code ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied! Enjoy your discount.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Checkout process with real-time stock deduction
  const processCheckout = async (
    shippingAddress: ShippingAddress,
    paymentDetails: PaymentDetails
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    // 1. Double check stock for all items
    for (const item of cart) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return { success: false, error: `Product not found: ${item.productName}` };
      }
      const variant = product.weightOptions.find((w) => w.id === item.weightOptionId);
      if (!variant) {
        return { success: false, error: `Variant not found: ${item.weightLabel}` };
      }
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.productName} (${item.weightLabel}). Only ${variant.stock} remaining.`,
        };
      }
    }

    const orderId = `DB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const estDeliveryDate = new Date(now.getTime() + 86400000 * 3);
    const trackingNum = `EXP-IND-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: now.toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartTotalDiscount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartShippingFee,
      taxAmount: cartTaxAmount,
      totalAmount: cartFinalTotal,
      shippingAddress,
      payment: paymentDetails,
      status: 'confirmed',
      trackingNumber: trackingNum,
      estimatedDelivery: estDeliveryDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      statusHistory: [
        {
          status: 'placed',
          timestamp: now.toISOString(),
          note: `Order received. Payment verified via ${paymentDetails.method.toUpperCase()} (${paymentDetails.transactionId}).`,
        },
        {
          status: 'confirmed',
          timestamp: new Date(now.getTime() + 1000).toISOString(),
          note: 'Allocated stock from central warehouse, packed with moisture barrier.',
        },
      ],
    };

    // 2. Deduct inventory & create audit logs
    const newLogs: InventoryLog[] = [];
    const updatedProducts = products.map((prod) => {
      const cartItemsForProd = cart.filter((c) => c.productId === prod.id);
      if (cartItemsForProd.length === 0) return prod;

      const updatedVariants = prod.weightOptions.map((variant) => {
        const cartItem = cartItemsForProd.find((c) => c.weightOptionId === variant.id);
        if (!cartItem) return variant;

        const previousStock = variant.stock;
        const newStock = Math.max(0, previousStock - cartItem.quantity);

        newLogs.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          productId: prod.id,
          productName: prod.name,
          sku: `${prod.sku}-${variant.skuModifier}`,
          weightLabel: variant.weightLabel,
          changeAmount: -cartItem.quantity,
          previousStock,
          newStock,
          reason: 'order_sale',
          referenceId: orderId,
          notes: `Sold via customer order #${orderId}`,
        });

        return {
          ...variant,
          stock: newStock,
        };
      });

      return {
        ...prod,
        weightOptions: updatedVariants,
      };
    });

    // Update state
    setProducts(updatedProducts);
    setInventoryLogs((prev) => [...newLogs, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderSuccess(newOrder);

    return { success: true, order: newOrder };
  };

  // Admin: Order status update
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const defaultNote =
            status === 'processing'
              ? 'Order is being processed at grain sorting facility.'
              : status === 'packed'
              ? 'Vacuum sealed in eco-jute pouches with QC batch verification.'
              : status === 'shipped'
              ? `Dispatched via courier (${order.trackingNumber}).`
              : status === 'delivered'
              ? 'Successfully delivered to customer doorstep.'
              : 'Order placed';

          return {
            ...order,
            status,
            statusHistory: [
              ...order.statusHistory,
              {
                status,
                timestamp: new Date().toISOString(),
                note: note || defaultNote,
              },
            ],
          };
        }
        return order;
      })
    );
  };

  // Admin: Inventory stock adjustment
  const adjustStock = (
    productId: string,
    weightOptionId: string,
    changeAmount: number,
    reason: InventoryLog['reason'],
    notes?: string
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedVariants = prod.weightOptions.map((variant) => {
          if (variant.id !== weightOptionId) return variant;
          const previousStock = variant.stock;
          const newStock = Math.max(0, previousStock + changeAmount);

          setInventoryLogs((logs) => [
            {
              id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: new Date().toISOString(),
              productId: prod.id,
              productName: prod.name,
              sku: `${prod.sku}-${variant.skuModifier}`,
              weightLabel: variant.weightLabel,
              changeAmount,
              previousStock,
              newStock,
              reason,
              notes: notes || `Manual stock adjustment (${changeAmount > 0 ? '+' : ''}${changeAmount})`,
            },
            ...logs,
          ]);

          return { ...variant, stock: newStock };
        });
        return { ...prod, weightOptions: updatedVariants };
      })
    );
  };

  // Admin: Restock batch
  const batchRestock = (
    productId: string,
    weightOptionId: string,
    addedUnits: number,
    supplier: string,
    invoiceNo: string,
    updatedCost?: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedVariants = prod.weightOptions.map((variant) => {
          if (variant.id !== weightOptionId) return variant;
          const previousStock = variant.stock;
          const newStock = previousStock + addedUnits;

          setInventoryLogs((logs) => [
            {
              id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: new Date().toISOString(),
              productId: prod.id,
              productName: prod.name,
              sku: `${prod.sku}-${variant.skuModifier}`,
              weightLabel: variant.weightLabel,
              changeAmount: addedUnits,
              previousStock,
              newStock,
              reason: 'restock',
              referenceId: invoiceNo,
              notes: `Batch intake from supplier: ${supplier}. Inv #${invoiceNo}`,
            },
            ...logs,
          ]);

          return { ...variant, stock: newStock };
        });

        return {
          ...prod,
          unitCost: updatedCost && updatedCost > 0 ? updatedCost : prod.unitCost,
          weightOptions: updatedVariants,
        };
      })
    );
  };

  // Admin: Add Product
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-custom-${Date.now()}`;
    const productWithId: Product = {
      ...newProd,
      id,
    };

    setProducts((prev) => [productWithId, ...prev]);

    // Log seed additions
    const initialLogs: InventoryLog[] = productWithId.weightOptions.map((v) => ({
      id: `log-${Date.now()}-${v.id}`,
      timestamp: new Date().toISOString(),
      productId: id,
      productName: productWithId.name,
      sku: `${productWithId.sku}-${v.skuModifier}`,
      weightLabel: v.weightLabel,
      changeAmount: v.stock,
      previousStock: 0,
      newStock: v.stock,
      reason: 'initial_seed',
      notes: 'Initial catalog creation',
    }));

    setInventoryLogs((prev) => [...initialLogs, ...prev]);
  };

  // Admin: Update Product
  const updateProduct = (productId: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...productData } : p))
    );
  };

  // Admin: Delete Product
  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Reset to seed
  const resetToSeedData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_DEMO_ORDERS);
    setInventoryLogs(INITIAL_LOGS);
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  // Inventory Dashboard metrics
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalInventoryValuation = 0;

  for (const prod of products) {
    for (const v of prod.weightOptions) {
      if (v.stock === 0) {
        outOfStockCount++;
      } else if (v.stock <= 10) {
        lowStockCount++;
      }
      // Value: stock * unitCost (scaled by weight)
      const approxCost = Math.round(prod.unitCost * (v.weightInKg || 1));
      totalInventoryValuation += v.stock * approxCost;
    }
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        inventoryLogs,
        appliedCoupon,
        currentView,
        activeCategory,
        searchQuery,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        isOrderTrackingOpen,
        activeOrderSuccess,
        setCurrentView,
        setActiveCategory,
        setSearchQuery,
        setSelectedProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsOrderTrackingOpen,
        setActiveOrderSuccess,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalDiscount,
        cartShippingFee,
        cartTaxAmount,
        cartFinalTotal,
        totalCartItemCount,
        applyCoupon,
        removeCoupon,
        processCheckout,
        updateOrderStatus,
        adjustStock,
        batchRestock,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToSeedData,
        lowStockCount,
        outOfStockCount,
        totalInventoryValuation,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
