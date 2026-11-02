"use client";

import React, { useState } from "react";
import { BellRing, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const CTASection: React.FC = () => {
  const [contactInput, setContactInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInput.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-950 via-[#1f0913] to-neutral-950 text-white relative overflow-hidden border-b border-rose-950/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Pulsing Tag */}
        <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
          <BellRing className="w-3.5 h-3.5 text-rose-400" />
          <span>Real-Time Sale Alerts</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
          Never Miss Another Flash Sale <br className="hidden sm:inline" />
          or Lawn Launch in Pakistan.
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 mt-3 max-w-xl mx-auto leading-relaxed">
          Be the first to know the minute <strong className="text-white">Gul Ahmed, Baroque, Asim Jofa, Limelight, or Sana Safinaz</strong> drop prices or announce clearance events.
        </p>

        {/* Signup / Alert Form */}
        <div className="mt-8 max-w-lg mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                placeholder="Enter email or WhatsApp number..."
                required
                className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-md border border-white/20 focus:border-rose-400 text-white placeholder-neutral-400 text-sm px-4 py-3.5 rounded-xl focus:outline-hidden transition-all shadow-inner"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-rose-600/30 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Get Free Alerts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-emerald-300 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                You're on the VIP list! You'll be notified of the next major flash sale.
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 mt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Spam Guaranteed
            </span>
            <span>•</span>
            <span>100% Free Service</span>
            <span>•</span>
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
