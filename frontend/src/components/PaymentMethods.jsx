import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Loader2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MOCK_CARDS = [
  {
    id: '1',
    brand: 'visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true,
    holder: 'Béchir Ben Hmida'
  },
  {
    id: '2',
    brand: 'mastercard',
    last4: '8888',
    expiry: '05/24', // Expiring soon
    isDefault: false,
    holder: 'Béchir Ben Hmida'
  }
];

export default function PaymentMethods() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(null); // 'saving', 'setting-default', 'removing'
  const [actionId, setActionId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card Brand Detection (Simple)
  const getBrand = (number) => {
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  // Formatting helpers
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    return value
      .replace(/[^0-9]/g, '')
      .replace(/^([2-9])/, '0$1')
      .replace(/^(1[3-9])/, '01')
      .replace(/^([0-1][0-9])([0-9])/, '$1/$2')
      .substring(0, 5);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') formattedValue = formatCardNumber(value);
    if (name === 'expiry') formattedValue = formatExpiry(value);
    if (name === 'cvv') formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.number || formData.number.length < 16) newErrors.number = 'Invalid card number';
    if (!formData.expiry || formData.expiry.length < 5) newErrors.expiry = 'Invalid expiry';
    if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    if (!formData.name) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCard = {
      id: Math.random().toString(36).substr(2, 9),
      brand: getBrand(formData.number.replace(/\s/g, '')),
      last4: formData.number.slice(-4),
      expiry: formData.expiry,
      isDefault: cards.length === 0,
      holder: formData.name
    };

    setCards([...cards, newCard]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ number: '', expiry: '', cvv: '', name: '' });
  };

  const handleSetDefault = async (id) => {
    setLoading('setting-default');
    setActionId(id);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
    setLoading(null);
    setActionId(null);
  };

  const handleRemove = async (id) => {
    if (cards.find(c => c.id === id).isDefault && cards.length > 1) {
      alert("Please set another card as default before removing this one.");
      return;
    }
    
    if (!confirm("Are you sure you want to remove this payment method?")) return;

    setLoading('removing');
    setActionId(id);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCards(cards.filter(card => card.id !== id));
    setLoading(null);
    setActionId(null);
  };

  const isExpiringSoon = (expiry) => {
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const expiryDate = new Date(2000 + year, month - 1);
    const diff = expiryDate.getTime() - now.getTime();
    return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payment Methods</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your cards and billing preferences</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl transition-all font-semibold shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Add Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
          <div className="bg-slate-800 p-4 rounded-full mb-4">
            <CreditCard size={32} className="text-slate-400" />
          </div>
          <h3 className="text-white font-semibold">No payment methods</h3>
          <p className="text-slate-400 text-sm mb-6">You haven't added any cards yet.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-primary hover:text-primary-dark font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Add your first card
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <div 
              key={card.id}
              className={cn(
                "group relative overflow-hidden flex items-center justify-between p-5 rounded-2xl border transition-all duration-300",
                card.isDefault 
                  ? "bg-slate-900/80 border-primary/50 shadow-xl shadow-primary/5" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                  {card.brand === 'visa' && <span className="text-blue-500 font-bold italic text-xl uppercase tracking-tighter">Visa</span>}
                  {card.brand === 'mastercard' && <div className="flex -space-x-2"><div className="w-5 h-5 bg-red-500 rounded-full opacity-80"/><div className="w-5 h-5 bg-orange-500 rounded-full opacity-80"/></div>}
                  {card.brand === 'unknown' && <CreditCard className="text-slate-500" />}
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-white tracking-widest">
                      •••• {card.last4}
                    </p>
                    {card.isDefault && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Check size={10} /> Default
                      </span>
                    )}
                    {isExpiringSoon(card.expiry) && (
                      <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20">
                        <AlertTriangle size={10} /> Expiring Soon
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-0.5">
                    Expires {card.expiry} • {card.holder}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!card.isDefault && (
                  <button 
                    disabled={loading !== null}
                    onClick={() => handleSetDefault(card.id)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    title="Set as default"
                  >
                    {loading === 'setting-default' && actionId === card.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                )}
                <button 
                  disabled={loading !== null || (card.isDefault && cards.length > 1)}
                  onClick={() => handleRemove(card.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Remove card"
                >
                   {loading === 'removing' && actionId === card.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-4 border-t border-slate-900">
        <ShieldCheck size={14} className="text-emerald-500" />
        Your payment data is encrypted and secure
      </div>

      {/* Add Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white">Add Card</h3>
              <p className="text-slate-400 text-sm mt-1">Enter your card details</p>
            </div>

            <form onSubmit={handleAddCard} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Card Number</label>
                <div className="relative">
                  <input
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    className={cn(
                      "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-primary transition-all",
                      errors.number && "border-red-500/50 focus:border-red-500"
                    )}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {getBrand(formData.number.replace(/\s/g, '')) === 'visa' && <span className="text-blue-500 font-bold italic text-xs uppercase tracking-tighter">Visa</span>}
                    {getBrand(formData.number.replace(/\s/g, '')) === 'mastercard' && <div className="flex -space-x-1.5"><div className="w-3.5 h-3.5 bg-red-500 rounded-full opacity-80"/><div className="w-3.5 h-3.5 bg-orange-500 rounded-full opacity-80"/></div>}
                  </div>
                </div>
                {errors.number && <p className="text-red-500 text-[10px] font-bold uppercase ml-1">{errors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Expiry</label>
                  <input
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={cn(
                      "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-primary transition-all",
                      errors.expiry && "border-red-500/50 focus:border-red-500"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">CVV</label>
                  <input
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="•••"
                    className={cn(
                      "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-primary transition-all",
                      errors.cvv && "border-red-500/50 focus:border-red-500"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Cardholder Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={cn(
                    "w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-primary transition-all",
                    errors.name && "border-red-500/50 focus:border-red-500"
                  )}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all text-sm shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    'Save Card'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
