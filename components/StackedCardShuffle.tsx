"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface StackedCardShuffleProps {
  products: Product[];
}

export const StackedCardShuffle: React.FC<StackedCardShuffleProps> = ({ products }) => {
  // Take top 10 products for the deck
  const deckProducts = React.useMemo(() => {
    return products.slice(0, 10);
  }, [products]);

  const [cards, setCards] = useState<Product[]>(deckProducts);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<"left" | "right" | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (deckProducts.length > 0) {
      setCards(deckProducts);
    }
  }, [deckProducts]);

  const dragStart = useRef({ x: 0, y: 0 });

  // Shuffle top card off-screen to the left or right, then cycle it to the back
  const shuffleNext = useCallback(
    (direction: "left" | "right" = "right") => {
      if (cards.length <= 1 || isAnimatingOut) return;
      setIsAnimatingOut(direction);

      setTimeout(() => {
        setCards((prev) => {
          const [topCard, ...rest] = prev;
          return [...rest, topCard];
        });
        setIsAnimatingOut(null);
        setDragOffset({ x: 0, y: 0 });
      }, 350);
    },
    [cards.length, isAnimatingOut]
  );

  // Auto-slide every 10 seconds if not hovered or dragging
  useEffect(() => {
    if (isPaused || isDragging || isAnimatingOut) return;
    const interval = setInterval(() => {
      shuffleNext("right");
    }, 10000);

    return () => clearInterval(interval);
  }, [isPaused, isDragging, isAnimatingOut, shuffleNext]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimatingOut) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isAnimatingOut) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setDragOffset({ x: dx, y: dy * 0.2 });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 75) {
      shuffleNext("right");
    } else if (dragOffset.x < -75) {
      shuffleNext("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
    setIsPaused(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingOut) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimatingOut) return;
    const dx = e.targetTouches[0].clientX - dragStart.current.x;
    const dy = e.targetTouches[0].clientY - dragStart.current.y;
    setDragOffset({ x: dx, y: dy * 0.2 });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 65) {
      shuffleNext("right");
    } else if (dragOffset.x < -65) {
      shuffleNext("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (cards.length === 0) return null;

  // Render top 4 cards for the fanned stack effect (matching Mo Rashidi reference)
  const visibleStack = cards.slice(0, 4);

  // Exact fan rotation angles and offsets from reference image
  const stackConfigs = [
    { rotate: 0, translateX: 0, translateY: 0, scale: 1, zIndex: 30, opacity: 1 },
    { rotate: -6, translateX: -16, translateY: -10, scale: 0.96, zIndex: 20, opacity: 0.8 },
    { rotate: -12, translateX: -32, translateY: -20, scale: 0.92, zIndex: 10, opacity: 0.55 },
    { rotate: -18, translateX: -48, translateY: -30, scale: 0.88, zIndex: 5, opacity: 0.3 },
  ];

  return (
    <div
      className="w-full max-w-[340px] select-none relative pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Fanned Stack Container */}
      <div className="relative h-[490px] w-full flex items-center justify-center pl-6">
        {visibleStack.map((product, index) => {
          const isTopCard = index === 0;
          const config = stackConfigs[index] || stackConfigs[stackConfigs.length - 1];
          const savings = product.originalPrice - product.salePrice;

          // Compute 3D transformation
          let transformStyle = "";
          let opacity = config.opacity;

          if (isTopCard) {
            if (isAnimatingOut === "right") {
              // Smooth left/right animation exit
              transformStyle = `translate3d(450px, 20px, 0) rotate(22deg) scale(0.9)`;
              opacity = 0;
            } else if (isAnimatingOut === "left") {
              transformStyle = `translate3d(-450px, 20px, 0) rotate(-22deg) scale(0.9)`;
              opacity = 0;
            } else if (isDragging) {
              const rotation = dragOffset.x * 0.08;
              transformStyle = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`;
            } else {
              transformStyle = `translate3d(0, 0, 0) rotate(0deg)`;
            }
          } else {
            // Background cards step forward smoothly during drag
            const dragInfluence = isDragging ? Math.min(Math.abs(dragOffset.x) / 250, 1) : 0;
            const currentRotate = config.rotate + dragInfluence * 6; // straighten up towards 0
            const currentTranslateX = config.translateX + dragInfluence * 16;
            const currentTranslateY = config.translateY + dragInfluence * 10;
            const currentScale = config.scale + dragInfluence * 0.04;

            transformStyle = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0) rotate(${currentRotate}deg) scale(${currentScale})`;
          }

          return (
            <div
              key={product.id}
              style={{
                transform: transformStyle,
                zIndex: config.zIndex,
                opacity,
                transformOrigin: "bottom center",
                transition: isDragging && isTopCard ? "none" : "all 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)",
              }}
              onMouseDown={isTopCard ? handleMouseDown : undefined}
              onMouseMove={isTopCard ? handleMouseMove : undefined}
              onMouseUp={isTopCard ? handleMouseUp : undefined}
              onTouchStart={isTopCard ? handleTouchStart : undefined}
              onTouchMove={isTopCard ? handleTouchMove : undefined}
              onTouchEnd={isTopCard ? handleTouchEnd : undefined}
              className={`absolute top-0 w-[310px] h-[460px] bg-[#16181f] text-white rounded-[32px] border border-white/15 p-5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between ${
                isTopCard ? "cursor-grab active:cursor-grabbing hover:border-white/30" : "pointer-events-none"
              }`}
            >
              {/* Reference Style: Top Row (Icon on left, Circular Arrow button on right) */}
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>

                <a
                  href={`/go/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (Math.abs(dragOffset.x) > 10) e.preventDefault();
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-md group/btn"
                  title={`Shop ${product.brandName}`}
                >
                  <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Reference Style: Bold Centered Destination Title */}
              <div className="text-center my-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                  {product.brandName}
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight line-clamp-1 mt-0.5">
                  {product.pieceCount || "LUXURY SUIT"}
                </h3>
              </div>

              {/* Reference Style: High-Res Inner Window Photo */}
              <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-neutral-800 shadow-inner my-2">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover object-top pointer-events-none"
                />

                {/* Reference Style: Centered Pill Tag Over Image (e.g. '$ High ROI') */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-rose-400 font-black">-{product.discountPct}% OFF</span>
                  <span className="text-neutral-400">•</span>
                  <span>Rs. {product.salePrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Reference Style: Card Description & Details */}
              <div className="text-center space-y-1 mb-1">
                <p className="text-[11px] text-neutral-300 font-medium line-clamp-2 leading-relaxed px-1">
                  {product.title}
                </p>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-0.5">
                  <span className="line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">Save Rs. {savings.toLocaleString()}</span>
                </div>
              </div>

              {/* Bottom Quick Shop Button */}
              <a
                href={`/go/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (Math.abs(dragOffset.x) > 10) e.preventDefault();
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-rose-600 text-white rounded-xl text-xs font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Shop on {product.brandName}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

            </div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === 0 ? "w-6 bg-rose-500" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
