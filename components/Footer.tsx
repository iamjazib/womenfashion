import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top Disclaimer Box */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-neutral-200 font-semibold mb-0.5">
                Affiliate & Pricing Transparency Disclosure
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                We may earn an affiliate commission when you make a purchase through links on our site at no extra cost to you. Product prices, discounts, and inventory are scanned dynamically from brand stores every few hours. Prices may change on the brand's official website. Always check the final price on the brand site.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700 shrink-0 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Free Service</span>
          </div>
        </div>

        {/* Brand Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-900">
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              Women's Lawn Brands
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-white transition-colors cursor-pointer">Gul Ahmed 3-Piece Lawn</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Baroque Swiss Lawn Specials</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Alkaram Heritage Unstitched</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Sana Safinaz Mahay Collection</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Zellbury Budget Lawn Suits</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              Designer Pret & Formals
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-white transition-colors cursor-pointer">Asim Jofa Wedding Chiffon</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Limelight Embroidered Pret</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">J. Lawn Printed Kurtas</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Baroque Chantelle Formals</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Ready to Wear 2-Piece Co-ords</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              Shop by Discount
            </h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-white transition-colors cursor-pointer">Flat 50% Off Women's Deals</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">40% Off Designer Pret</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Under Rs. 3,500 Daily Suits</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">End of Season Clearance</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Lowest Price in 30 Days</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              About Women Fashion
            </h4>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Pakistan's dedicated sale radar for women's fashion. We track real-time price drops across the country's most beloved women's couture and lawn labels with zero fake markups.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Women Fashion. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Brand Partnerships</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
