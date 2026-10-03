import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    orders,
  } = useStore();

  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase().replace('#', '');
    const found = orders.find((o) => o.id === clean || o.trackingNumber === clean);
    if (found) {
      setSelectedOrder(found);
    }
  };

  const statusSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Payment verified & order recorded' },
    { status: 'confirmed', label: 'Confirmed & Allocated', desc: 'Grains reserved in warehouse' },
    { status: 'packed', label: 'Packed & Vacuum Sealed', desc: 'Moisture barrier packaging QC pass' },
    { status: 'shipped', label: 'Handed to Courier', desc: 'Dispatched via express road/air freight' },
    { status: 'delivered', label: 'Delivered', desc: 'Handed over at doorstep' },
  ];

  const getStepState = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = statusSteps.findIndex((s) => s.status === currentStatus);
    const stepIndex = statusSteps.findIndex((s) => s.status === stepStatus);

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base font-display">
                DesiBazaar Live Grain Delivery Tracker
              </h3>
              <p className="text-[11px] text-stone-400">
                Track temperature-controlled grain dispatch & courier status
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. DB-8924) or Tracking Number"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-stone-900 hover:bg-amber-600 text-white hover:text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              Track
            </button>
          </form>

          {/* Quick Order Tabs */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-400 text-[11px] shrink-0 font-medium">Recent Orders:</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono shrink-0 transition ${
                    selectedOrder?.id === o.id
                      ? 'bg-amber-600 text-white border-amber-600 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  #{o.id} ({o.status})
                </button>
              ))}
            </div>
          )}

          {/* Selected Order Display */}
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-base">
                      #{selectedOrder.id}
                    </span>
                    <span className="bg-amber-100 text-amber-800 font-bold text-xs uppercase px-2 py-0.5 rounded">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Carrier: <span className="font-semibold text-stone-700">Delhivery Express</span> • Waybill:{' '}
                    <span className="font-mono text-amber-800">{selectedOrder.trackingNumber}</span>
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Estimated Delivery
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {selectedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Progress Timeline */}
              <div className="space-y-4 py-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Shipment Progress Timeline
                </h4>

                <div className="space-y-3">
                  {statusSteps.map((step, idx) => {
                    const state = getStepState(step.status, selectedOrder.status);
                    return (
                      <div key={step.status} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                              state === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : state === 'current'
                                ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                                : 'bg-stone-200 text-stone-400'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-7 ${
                                state === 'completed' ? 'bg-emerald-500' : 'bg-stone-200'
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 pb-1">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-xs font-bold ${
                                state === 'upcoming' ? 'text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {step.label}
                            </h5>
                            {state === 'current' && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] ${
                              state === 'upcoming' ? 'text-stone-400' : 'text-stone-600'
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this parcel */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Parcel Contents ({selectedOrder.items.length} items)
                </h4>
                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((i) => (
                    <div key={i.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={i.imageUrl}
                          alt={i.productName}
                          className="w-8 h-8 rounded object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-semibold text-stone-800">{i.productName}</p>
                          <p className="text-[10px] text-stone-400">{i.weightLabel} × {i.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-bold text-stone-800 block text-[10px] uppercase mb-1">
                  Delivering To:
                </span>
                <p className="font-semibold text-stone-900">{selectedOrder.shippingAddress.fullName}</p>
                <p>{selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}</p>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-stone-500 text-xs">
              No orders found with that ID. Try searching <strong>DB-8924</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
