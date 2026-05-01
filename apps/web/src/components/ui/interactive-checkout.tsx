"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, MapPin, Receipt, Clock, Info, CreditCard, Smartphone, Banknote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { useCart } from "@/context/CartContext";

export type PaymentMethod = 'upi' | 'card' | 'cod';

interface InteractiveCheckoutProps {
    onCheckout: (method: PaymentMethod) => void;
    loading: boolean;
}

function InteractiveCheckout({ onCheckout, loading }: InteractiveCheckoutProps) {
    const { cart, updateQuantity, removeItem, subtotal } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

    const deliveryFee = subtotal >= 20000 ? 0 : 2000;
    const handlingFee = 500;
    const totalPrice = subtotal + deliveryFee + handlingFee;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="w-full mx-auto pb-32">
            <div className="flex flex-col gap-3 px-4">
                
                {/* Delivery Address Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="mt-0.5 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-sm font-black text-gray-900">Delivery at Home</h3>
                                <button className="text-[10px] font-bold text-rose-600 uppercase tracking-wide bg-rose-50 px-2 py-1 rounded-md">Change</button>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Dilong Ward, House 42, Mokokchung
                                <br/>Near Ao Baptist Church
                            </p>
                            <p className="text-xs font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-green-600" />
                                Delivery in 15 mins
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center justify-between">
                        Items in your cart
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{totalItems} items</span>
                    </h3>
                    
                    <div className="space-y-4">
                        <AnimatePresence initial={false} mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex gap-3 group relative"
                                >
                                    <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={item.image || (item.type === 'dark_store' ? "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&q=80" : "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&q=80")}
                                            alt={item.name}
                                            fill
                                            className="object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <div className="pr-2">
                                                <h4 className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[10px] font-medium text-gray-500 mt-0.5">{item.unit || '1 unit'}</p>
                                                <span className="font-bold text-gray-900 text-sm mt-1 block">
                                                    ₹{((item.price * item.quantity) / 100).toFixed(2)}
                                                </span>
                                            </div>
                                            
                                            {/* Qty Stepper */}
                                            <div className="flex items-center bg-rose-50 border border-rose-200 rounded-lg h-7 mt-1 shrink-0">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-full flex items-center justify-center text-rose-600 font-bold hover:bg-rose-100 transition-colors rounded-l-lg">
                                                    {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : "-"}
                                                </button>
                                                <span className="w-5 text-center text-xs font-bold text-rose-600">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-full flex items-center justify-center text-rose-600 font-bold hover:bg-rose-100 transition-colors rounded-r-lg">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex items-start gap-2">
                        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                            Any instructions for the delivery partner? Let them know.
                        </p>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        <label className={cn(
                            "flex items-center p-3 rounded-xl border cursor-pointer transition-colors",
                            paymentMethod === 'upi' ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200 hover:bg-gray-50"
                        )}>
                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center mr-3", paymentMethod === 'upi' ? "border-rose-500" : "border-gray-300")}>
                                {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                            </div>
                            <Smartphone className={cn("w-5 h-5 mr-3", paymentMethod === 'upi' ? "text-rose-600" : "text-gray-500")} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">UPI</p>
                                <p className="text-[10px] font-medium text-gray-500">Google Pay, PhonePe, Paytm</p>
                            </div>
                        </label>

                        <label className={cn(
                            "flex items-center p-3 rounded-xl border cursor-pointer transition-colors",
                            paymentMethod === 'card' ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200 hover:bg-gray-50"
                        )}>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center mr-3", paymentMethod === 'card' ? "border-rose-500" : "border-gray-300")}>
                                {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                            </div>
                            <CreditCard className={cn("w-5 h-5 mr-3", paymentMethod === 'card' ? "text-rose-600" : "text-gray-500")} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">Credit / Debit Card</p>
                                <p className="text-[10px] font-medium text-gray-500">Visa, MasterCard, RuPay</p>
                            </div>
                        </label>

                        <label className={cn(
                            "flex items-center p-3 rounded-xl border cursor-pointer transition-colors",
                            paymentMethod === 'cod' ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200 hover:bg-gray-50"
                        )}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center mr-3", paymentMethod === 'cod' ? "border-rose-500" : "border-gray-300")}>
                                {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                            </div>
                            <Banknote className={cn("w-5 h-5 mr-3", paymentMethod === 'cod' ? "text-rose-600" : "text-gray-500")} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                                <p className="text-[10px] font-medium text-gray-500">Pay at your doorstep</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Bill Summary Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-500" /> Bill Details
                    </h3>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-600">Item Total</span>
                            <span className="text-gray-900 font-bold">₹<NumberFlow value={subtotal / 100} /></span>
                        </div>
                        
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-600">Handling Fee</span>
                            <span className="text-gray-900 font-bold">₹{handlingFee / 100}</span>
                        </div>

                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className={deliveryFee === 0 ? "text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded" : "text-gray-900 font-bold"}>
                                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee / 100}`}
                            </span>
                        </div>
                        
                        {deliveryFee > 0 && (
                            <p className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1.5 rounded-lg text-center border border-rose-100">
                                Add items worth ₹{((20000 - subtotal) / 100).toFixed(0)} more for FREE delivery
                            </p>
                        )}
                        
                        <div className="pt-3 mt-1 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="font-black text-sm text-gray-900 block">To Pay</span>
                                <span className="text-[10px] text-gray-500 font-medium">Incl. all taxes and charges</span>
                            </div>
                            <span className="font-black text-lg text-gray-900">
                                ₹<NumberFlow value={totalPrice / 100} />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 mb-1">Cancellation Policy</h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                    </p>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={() => onCheckout(paymentMethod)}
                    disabled={loading || cart.length === 0}
                    className="w-full h-14 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-between px-5 hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="text-left">
                        <span className="block text-sm font-black">₹{totalPrice / 100}</span>
                        <span className="block text-[10px] font-bold text-green-100 uppercase tracking-wide">TOTAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-sm font-black uppercase tracking-wide">
                                    {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Pay'}
                                </span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}

export { InteractiveCheckout }
