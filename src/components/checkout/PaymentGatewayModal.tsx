import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress, PaymentDetails, PaymentMethod } from '../../types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

export const PaymentGatewayModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartFinalTotal,
    cartSubtotal,
    cartTotalDiscount,
    cartShippingFee,
    cartTaxAmount,
    cart,
    processCheckout,
  } = useStore();

  // Step 1: Shipping Address | Step 2: Payment Gateway | Step 3: 3DS OTP Verification
  const [step, setStep] = useState<'shipping' | 'payment' | 'otp_verify'>('shipping');

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98192 83746',
    streetAddress: 'Flat 304, Palm Grove Heights, MG Road',
    apartment: 'Tower B, Wing 2',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    country: 'India',
    deliveryNotes: 'Please ring bell twice. Desi grain sack packaging.',
  });

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8921 4452 9018');
  const [cardHolder, setCardHolder] = useState('RAHUL SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('742');

  // UPI details
  const [upiId, setUpiId] = useState('rahulsharma@okhdfcbank');
  const [upiTab, setUpiTab] = useState<'qr' | 'id'>('qr');
  const [upiTimer, setUpiTimer] = useState(299);

  // Net banking details
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // COD verification
  const [codCaptcha, setCodCaptcha] = useState('7829');
  const [codInput, setCodInput] = useState('');

  // 3DS OTP Verification Simulation
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (step === 'payment' && upiTab === 'qr') {
      interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, upiTab]);

  if (!isCheckoutOpen) return null;

  // Format Card Number
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Card brand detection
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('60') || clean.startsWith('65')) return 'RuPay';
    if (clean.startsWith('37')) return 'Amex';
    return 'Card';
  };

  // Trigger Payment Processing
  const handleProceedToVerify = () => {
    setPaymentError(null);

    // Validation
    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry.includes('/')) {
        setPaymentError('Please enter card expiry in MM/YY format.');
        return;
      }
      if (cardCvv.length < 3) {
        setPaymentError('Please enter a valid 3 or 4 digit CVV.');
        return;
      }
    } else if (paymentMethod === 'upi' && upiTab === 'id') {
      if (!upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI ID (e.g., yourname@okhdfcbank).');
        return;
      }
    } else if (paymentMethod === 'cod') {
      if (codInput !== codCaptcha) {
        setPaymentError('Incorrect captcha code. Please match the 4-digit code shown.');
        return;
      }
    }

    // Generate fresh OTP for Card or NetBanking
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode('');
    setStep('otp_verify');
  };

  // Final 3DS OTP Submission
  const handleVerifyOtpAndComplete = async () => {
    if (paymentMethod !== 'cod' && otpCode !== generatedOtp) {
      setPaymentError(`Invalid OTP. For demonstration, please enter ${generatedOtp} or click "Auto-fill OTP".`);
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      status: 'paid',
      transactionId: `TXN-DB-${Math.floor(100000000 + Math.random() * 900000000)}`,
      cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : undefined,
      cardBrand: paymentMethod === 'card' ? getCardBrand() : undefined,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
      paidAt: new Date().toISOString(),
    };

    setTimeout(async () => {
      const result = await processCheckout(shippingAddress, paymentDetails);
      setIsProcessingPayment(false);

      if (result.success) {
        setIsCheckoutOpen(false);
        setStep('shipping');
      } else {
        setPaymentError(result.error || 'Payment failed during inventory allocation.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gateway Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm font-display text-white">
                  DesiBazaar Secure Payment Gateway
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                PCI-DSS Level 1 Compliant • RBI Tokenization Certified
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="bg-stone-100/80 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setStep('shipping')}
            className={`flex items-center gap-1.5 transition ${
              step === 'shipping' ? 'text-amber-800 font-bold' : 'text-stone-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>Delivery Address</span>
          </button>

          <span className="text-stone-300">→</span>

          <button
            onClick={() => setStep('payment')}
            className={`flex items-center gap-1.5 transition ${
              step === 'payment' ? 'text-amber-800 font-bold' : 'text-stone-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Payment Method</span>
          </button>

          <span className="text-stone-300">→</span>

          <div
            className={`flex items-center gap-1.5 ${
              step === 'otp_verify' ? 'text-amber-800 font-bold' : 'text-stone-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>3D-Secure / OTP</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* STEP 1: Shipping Address */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-base">
                  Shipping & Packaging Address
                </h3>
                <span className="text-xs text-stone-500">
                  Total Items: {cart.reduce((s, i) => s + i.quantity, 0)} bags
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                    placeholder="Enter full recipient name"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Mobile Number (For Delivery SMS)</label>
                  <input
                    type="text"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Email Address (For Tax Invoice)</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Street Address, House No. / Society</label>
                  <input
                    type="text"
                    value={shippingAddress.streetAddress}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                    placeholder="Flat / Floor / Street name"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={shippingAddress.pinCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pinCode: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={shippingAddress.country}
                    className="w-full border border-stone-200 rounded-lg p-2.5 bg-stone-100 text-stone-500 font-medium"
                  />
                </div>
              </div>

              {/* Order summary mini snippet */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500">Payable Total (inc. GST & Delivery):</span>
                  <p className="font-bold text-base text-stone-900 font-display">
                    ₹{cartFinalTotal.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <span>Select Payment Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    Select Secure Payment Option
                  </h3>
                  <p className="text-xs text-stone-500">
                    Encrypted through high-security banking gateways
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Total to Pay</span>
                  <span className="text-lg font-bold text-amber-700 font-display">
                    ₹{cartFinalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                    paymentMethod === 'card'
                      ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>Cards</span>
                  <span className="text-[9px] text-stone-400">RuPay, Visa, MC</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                    paymentMethod === 'upi'
                      ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>UPI Instant</span>
                  <span className="text-[9px] text-stone-400">GPay, PhonePe, QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Net Banking</span>
                  <span className="text-[9px] text-stone-400">All Major Banks</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                    paymentMethod === 'cod'
                      ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-700" />
                  <span>Cash on Delivery</span>
                  <span className="text-[9px] text-stone-400">Pay at Doorstep</span>
                </button>
              </div>

              {/* PAYMENT OPTION 1: CREDIT / DEBIT CARD */}
              {paymentMethod === 'card' && (
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">
                      Card Details ({getCardBrand()})
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px]">End-to-End Encrypted</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4532 •••• •••• ••••"
                          maxLength={19}
                          className="w-full border border-stone-300 rounded-lg p-2.5 bg-white font-mono text-stone-900 font-semibold tracking-wider focus:outline-none focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {getCardBrand()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 font-semibold mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full border border-stone-300 rounded-lg p-2.5 bg-white font-mono text-stone-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 font-semibold mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full border border-stone-300 rounded-lg p-2.5 bg-white font-mono text-stone-900 tracking-widest focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-semibold mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NAME AS PRINTED ON CARD"
                        className="w-full border border-stone-300 rounded-lg p-2.5 bg-white text-stone-900 font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 2: UPI */}
              {paymentMethod === 'upi' && (
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex border-b border-stone-200 pb-2 gap-4 text-xs font-bold">
                    <button
                      onClick={() => setUpiTab('qr')}
                      className={`pb-1 transition ${
                        upiTab === 'qr' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-500'
                      }`}
                    >
                      Instant Dynamic QR Code
                    </button>
                    <button
                      onClick={() => setUpiTab('id')}
                      className={`pb-1 transition ${
                        upiTab === 'id' ? 'text-amber-700 border-b-2 border-amber-600' : 'text-stone-500'
                      }`}
                    >
                      Enter UPI VPA / ID
                    </button>
                  </div>

                  {upiTab === 'qr' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                      <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-stone-300 shadow-sm flex flex-col items-center">
                        {/* Dynamic SVG QR representation */}
                        <div className="w-36 h-36 bg-stone-900 rounded-xl p-2 flex flex-col justify-between items-center text-white">
                          <div className="w-full flex justify-between">
                            <div className="w-7 h-7 border-2 border-white rounded bg-white/20 p-0.5">
                              <div className="w-full h-full bg-white rounded-xs" />
                            </div>
                            <div className="w-7 h-7 border-2 border-white rounded bg-white/20 p-0.5">
                              <div className="w-full h-full bg-white rounded-xs" />
                            </div>
                          </div>
                          <div className="text-center font-bold text-[10px] tracking-widest text-amber-400">
                            ₹{cartFinalTotal.toFixed(2)}
                          </div>
                          <div className="w-full flex justify-between">
                            <div className="w-7 h-7 border-2 border-white rounded bg-white/20 p-0.5">
                              <div className="w-full h-full bg-white rounded-xs" />
                            </div>
                            <QrCode className="w-6 h-6 text-amber-400" />
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono mt-1.5">
                          Scan with any UPI App
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-stone-600 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-700 font-semibold">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>QR valid for: {Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Open Google Pay, PhonePe, Paytm or BHIM on your smartphone, scan this QR code, and approve payment.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <span className="bg-white border px-2 py-0.5 rounded text-[10px] font-bold text-stone-700">Google Pay</span>
                          <span className="bg-white border px-2 py-0.5 rounded text-[10px] font-bold text-stone-700">PhonePe</span>
                          <span className="bg-white border px-2 py-0.5 rounded text-[10px] font-bold text-stone-700">Paytm</span>
                          <span className="bg-white border px-2 py-0.5 rounded text-[10px] font-bold text-stone-700">BHIM</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Enter your UPI ID / Virtual Payment Address
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okhdfcbank"
                          className="w-full border border-stone-300 rounded-lg p-2.5 bg-white text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500">
                        We will send a payment collect request of <strong>₹{cartFinalTotal.toFixed(2)}</strong> to your UPI app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT OPTION 3: NET BANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
                  <span className="text-xs font-bold text-stone-700 block">
                    Choose Your Bank
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'HDFC Bank',
                      'State Bank of India',
                      'ICICI Bank',
                      'Axis Bank',
                      'Kotak Mahindra Bank',
                      'Punjab National Bank',
                    ].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                          selectedBank === bank
                            ? 'bg-amber-100/70 border-amber-600 text-stone-900 ring-1 ring-amber-600'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        🏛️ {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 4: COD */}
              {paymentMethod === 'cod' && (
                <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Cash on Delivery Verification</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    To prevent automated bot orders and ensure authentic grain dispatch, please enter the anti-fraud code below:
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-stone-800 text-amber-400 font-mono text-base font-black px-4 py-2 rounded-lg tracking-widest select-none">
                      {codCaptcha}
                    </div>
                    <input
                      type="text"
                      value={codInput}
                      onChange={(e) => setCodInput(e.target.value)}
                      placeholder="Enter 4 digits"
                      maxLength={4}
                      className="w-32 border border-stone-300 rounded-lg p-2 text-xs font-mono text-stone-900 font-bold text-center focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  ← Back to Address
                </button>

                <button
                  onClick={handleProceedToVerify}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md shadow-amber-600/20 active:scale-[0.98]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {paymentMethod === 'cod'
                      ? `Confirm COD Order (₹${cartFinalTotal.toFixed(2)})`
                      : `Pay ₹${cartFinalTotal.toFixed(2)} Securely`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 3D Secure / OTP Verification Screen */}
          {step === 'otp_verify' && (
            <div className="space-y-5 text-center sm:text-left">
              <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {paymentMethod === 'card'
                        ? `${getCardBrand()} 3D-Secure 2.0 Authentication`
                        : paymentMethod === 'upi'
                        ? 'Simulated UPI Collect Approval'
                        : paymentMethod === 'netbanking'
                        ? `${selectedBank} Internet Banking Gateway`
                        : 'SMS Order Confirmation'}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Merchant: <span className="text-amber-400">DesiBazaar Heritage Pantry Ltd.</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Amount</span>
                  <span className="text-lg font-bold text-amber-400 font-display">
                    ₹{cartFinalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* OTP Simulation Box */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Enter Verification OTP
                  </h4>
                  <p className="text-xs text-stone-600">
                    A secure one-time passcode has been sent to your registered mobile number ending with{' '}
                    <strong>{shippingAddress.phone.slice(-4)}</strong>.
                  </p>
                </div>

                {/* Test Helper Notice */}
                <div className="bg-white p-3 rounded-xl border border-amber-300 text-xs flex items-center justify-between text-stone-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Demo Simulator OTP: <strong className="font-mono text-sm text-stone-950">{generatedOtp}</strong></span>
                  </div>
                  <button
                    onClick={() => setOtpCode(generatedOtp)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md transition"
                  >
                    Auto-fill OTP
                  </button>
                </div>

                {/* Input Field */}
                <div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full border-2 border-stone-300 rounded-xl p-3 text-center font-mono text-xl tracking-[0.5em] font-black text-stone-900 bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                {paymentError && (
                  <p className="text-xs text-rose-600 font-medium text-center">
                    {paymentError}
                  </p>
                )}

                {/* Confirm Payment button */}
                <button
                  onClick={handleVerifyOtpAndComplete}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Allocating Inventory & Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authenticate & Complete Order</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs text-stone-500">
                <button
                  onClick={() => setStep('payment')}
                  className="hover:underline"
                >
                  Cancel or Choose Different Payment
                </button>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Secure RBI Compliant Gateway
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
