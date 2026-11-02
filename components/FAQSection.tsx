"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is Women Fashion and how does it work?",
      answer:
        "Women Fashion is Pakistan's first dedicated sale aggregator for women's clothing. An automated robot scans top Pakistani brand websites (Gul Ahmed, Baroque, Asim Jofa, Limelight, Sana Safinaz, Junaid Jamshed, Alkaram, Zellbury) every few hours. It extracts live discounts, verifies them against historical prices, and presents them in one searchable catalog.",
    },
    {
      question: "Do I purchase clothes directly on Women Fashion or the brand's store?",
      answer:
        "You always purchase directly from the brand's official online store! When you click 'Shop on [Brand]', you are instantly redirected to that specific product on the brand's verified website. You enjoy 100% authentic designer items, official brand invoices, standard shipping, and official return policies.",
    },
    {
      question: "How do you detect fake sales and price hikes?",
      answer:
        "A common issue in seasonal fashion sales is brands raising their original prices right before announcing a discount. Women Fashion tracks every product's price over time. Our system calculates real discounts against historical benchmarks to ensure you only see verified, authentic price drops.",
    },
    {
      question: "Is Women Fashion free to use?",
      answer:
        "Yes, 100% free for all shoppers! There is no signup required and zero added fees. We may earn a modest affiliate commission from partner brands when you buy through our links, which helps keep this service running without costing you a single extra rupee.",
    },
    {
      question: "How often are prices and sales updated?",
      answer:
        "Our scanner runs automated scan cycles every 3 hours. When a brand launches a flash sale, it is indexed automatically. When a sale ends or items go out of stock, our 2-scan confirmation rule safely hides the deal to ensure you don't encounter expired promotions.",
    },
    {
      question: "Can I filter specifically by 3-piece lawn, pret, or discount percentage?",
      answer:
        "Absolutely. You can filter by piece count (3 Piece, 2 Piece, 1 Piece Kurti), category (Unstitched Lawn, Ready to Wear Pret, Festive Luxury), discount tier (Flat 50%+, 40%+, 30%+), or maximum budget (e.g. Under Rs. 3,500).",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
            Got Questions? We've Got Answers.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Everything you need to know about tracking Pakistani women's clothing sales and price verification.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 hover:text-rose-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-neutral-900 text-white rotate-180"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
