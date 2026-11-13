import React from "react";
import Link from "next/link";
import { ShieldCheck, Info, Building2, ExternalLink, ArrowRight } from "lucide-react";

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
          {/* Column 1: Women's Lawn Brands */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px] flex items-center gap-1.5">
              <span>Women's Lawn Brands</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/brand/gul-ahmed" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Gul Ahmed 3-Piece Lawn</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/baroque" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Baroque Swiss Lawn Specials</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/nishat-linen" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Nishat Linen Embroidered Suits</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/sapphire" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Sapphire Unstitched Lawn</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/alkaram" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Alkaram Heritage Unstitched</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/sana-safinaz" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Sana Safinaz Mahay Collection</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/zellbury" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Zellbury Budget Lawn Suits</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Designer Pret & Formals */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              Designer Pret & Formals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/brand/asim-jofa" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Asim Jofa Wedding Chiffon</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/sapphire" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Sapphire Ready to Wear Pret</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/nishat-linen" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Nishat Linen Luxury Pret</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/limelight" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Limelight Embroidered Pret</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/j-junaid-jamshed" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>J. Lawn Printed Kurtas</span>
                </Link>
              </li>
              <li>
                <Link href="/brand/baroque" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Baroque Chantelle Formals</span>
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Ready to Wear 2-Piece Co-ords</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop by Discount */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              Shop by Discount
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-rose-500">★</span>
                  <span>Flat 50% Off Women's Deals</span>
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>40% Off Designer Pret</span>
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Under Rs. 3,500 Daily Suits</span>
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>End of Season Clearance</span>
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-rose-400 transition-colors inline-flex items-center gap-1 group">
                  <span className="text-neutral-500 group-hover:text-rose-400">›</span>
                  <span>Lowest Price in 30 Days</span>
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 mt-2">
                  <span>Browse All 10 Brands Directory →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About & Partner Portal */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">
              About Women Fashion
            </h4>
            <p className="text-[11px] leading-relaxed text-neutral-400 mb-4">
              Pakistan's dedicated sale radar for women's fashion. We track real-time price drops across 10 top women's couture and lawn labels (Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire, Limelight, Sana Safinaz, J., Alkaram Studio, and Zellbury) with zero fake markups.
            </p>

            <div className="space-y-2">
              <Link
                href="/brand-portal"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-rose-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/10 hover:border-rose-500"
              >
                <Building2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Register Brand on Radar</span>
              </Link>

              <div>
                <Link
                  href="/admin"
                  className="text-[10px] text-neutral-500 hover:text-neutral-300 underline block"
                >
                  Admin Portal Access
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Women Fashion Deals. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/brand-portal" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
              Brand Partner Portal
            </Link>
            <span>•</span>
            <Link href="/brands" className="hover:text-white transition-colors">
              Brands Directory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
