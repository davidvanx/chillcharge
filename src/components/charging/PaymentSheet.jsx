import React, { useState } from "react";
import { X, Apple, CreditCard, Plus, Check, Zap, Lock } from "lucide-react";

export default function PaymentSheet({ station, onClose, onConfirm }) {
  const [method, setMethod] = useState(null);
  const [done, setDone] = useState(false);
  if (!station) return null;

  const confirm = () => {
    setDone(true);
    setTimeout(() => {
      onConfirm?.(station);
      onClose();
    }, 1800);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-[2rem] shadow-2xl max-h-[82%] overflow-y-auto animate-in slide-in-from-bottom no-scrollbar pb-safe">
        <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-neutral-200" />
        </div>
        <div className="px-5 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-neutral-900">איך תרצו לשלם?</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center active:scale-90 transition">
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
          <p className="text-[13px] text-neutral-500 mt-1">{station.name} • {station.power_kw} kW</p>

          {done ? (
            <div className="mt-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-[16px] font-bold text-neutral-900">הטעינה התחילה!</h3>
              <p className="text-[13px] text-neutral-500 mt-1">התשלום אושר. ניתן לנתק את הכבל בסיום.</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setMethod("apple")}
                className={`mt-5 w-full h-14 rounded-2xl flex items-center gap-3 px-4 border-2 transition active:scale-[0.98] ${method === "apple" ? "border-neutral-900 bg-neutral-50" : "border-neutral-100 bg-white"}`}
              >
                <span className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                  <Apple className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 text-right">
                  <div className="text-[15px] font-bold text-neutral-900">Apple Pay</div>
                  <div className="text-[12px] text-neutral-400">תשלום מהיר עם Face ID</div>
                </div>
                {method === "apple" && <Check className="w-5 h-5 text-emerald-600" />}
              </button>

              <button
                onClick={() => setMethod("card")}
                className={`mt-3 w-full h-14 rounded-2xl flex items-center gap-3 px-4 border-2 transition active:scale-[0.98] ${method === "card" ? "border-emerald-500 bg-emerald-50" : "border-neutral-100 bg-white"}`}
              >
                <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </span>
                <div className="flex-1 text-right">
                  <div className="text-[15px] font-bold text-neutral-900">כרטיס אשראי</div>
                  <div className="text-[12px] text-neutral-400">הוספת כרטיס חדש</div>
                </div>
                <Plus className="w-5 h-5 text-neutral-400" />
              </button>

              {method === "card" && (
                <div className="mt-4 space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-[12px] font-medium text-neutral-500">מספר כרטיס</label>
                    <input className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-[14px] outline-none focus:border-emerald-400" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[12px] font-medium text-neutral-500">תוקף</label>
                      <input className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-[14px] outline-none focus:border-emerald-400" placeholder="MM/YY" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[12px] font-medium text-neutral-500">CVV</label>
                      <input className="mt-1 w-full h-11 rounded-xl border border-neutral-200 px-3 text-[14px] outline-none focus:border-emerald-400" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-right">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12px] font-bold text-amber-800">החזקה בכרטיס בסך 200 ₪</div>
                  <div className="text-[11px] text-amber-700/90 mt-0.5 leading-relaxed">
                    בתחילת הטעינה תוחזק יתרה זמנית של 200 ₪. ההפרש בין עלות הטעינה בפועל לבין ההחזקה יוחזר לחשבונך במלואו וללא עמלות.
                  </div>
                </div>
              </div>

              <button
                onClick={confirm}
                disabled={!method}
                className="mt-3 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[15px] flex items-center justify-center gap-2 disabled:opacity-40 active:scale-95 transition shadow-lg shadow-emerald-500/30"
              >
                <Zap className="w-4 h-4 fill-white" />
                {method === "apple" ? "שלם עם Apple Pay" : method === "card" ? "אשר והתחל טעינה" : "בחרו שיטת תשלום"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}