import React from 'react';
import { X, ArrowRight, Shield, Zap, Sparkles, Heart, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div id="how-to-play-modal" className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl bg-stone-900 border-3 border-stone-600 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-stone-800 border-b-2 border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-pixel text-sm">
            <HelpCircle size={18} />
            <span>HOW TO PLAY</span>
          </div>
          <button
            id="close-how-to-play-btn"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-silkscreen text-xs text-stone-300">
          {/* Controls Section */}
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
            <h3 className="font-pixel text-[11px] text-emerald-400 mb-2">1. CONTROLS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="bg-stone-800 px-2 py-1 rounded text-white font-pixel text-[9px] border border-stone-700">A / D / ← →</span>
                <span>Move Left / Right</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-stone-800 px-2 py-1 rounded text-white font-pixel text-[9px] border border-stone-700">SPACE / W / ↑</span>
                <span>Jump (Hold for higher leap)</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-stone-400">
              * On mobile or tablets, intuitive on-screen touch buttons will appear automatically!
            </p>
          </div>

          {/* Combat & Worm Stomping */}
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
            <h3 className="font-pixel text-[11px] text-amber-400 mb-2">2. DEFEATING ENEMIES</h3>
            <p className="mb-2 leading-relaxed">
              Jump and <strong className="text-white">stomp on worms from above</strong> to squash them! Bouncing on enemies grants upward thrust. Touching enemies from the side inflicts damage.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-yellow-300 bg-yellow-950/30 p-2 rounded border border-yellow-800/40">
              <Sparkles size={14} />
              <span>
                <strong>Combo System:</strong> Chain stomps within 3 seconds for COMBO x2, x3, x4 score multipliers!
              </span>
            </div>
          </div>

          {/* Surprise Box */}
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
            <h3 className="font-pixel text-[11px] text-rose-400 mb-2">3. SURPRISE BOX (?)</h3>
            <p className="mb-2 leading-relaxed">
              Jump and headbutt glowing golden <strong className="text-white">"?" boxes from below</strong> to receive randomized fruit powers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5 text-red-300">
                <Zap size={12} /> <span><strong>Strawberry:</strong> Super speed boost</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-300">
                <ArrowRight size={12} /> <span><strong>Orange:</strong> High leap power</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <Shield size={12} /> <span><strong>Grape Shield:</strong> Absorbs 1 hit</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-300">
                <Sparkles size={12} /> <span><strong>Watermelon:</strong> Smash armored foes</span>
              </div>
              <div className="flex items-center gap-1.5 text-pink-300">
                <Heart size={12} /> <span><strong>Extra Life:</strong> +1 Life heart</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <span>⚠️ <strong>Surprise Worm:</strong> Watch out for tricks!</span>
              </div>
            </div>
          </div>

          {/* Golden Fruit & Secret Areas */}
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
            <h3 className="font-pixel text-[11px] text-yellow-400 mb-2">4. GOLDEN FRUITS & SECRET GROVES</h3>
            <p className="leading-relaxed">
              Each level holds <strong className="text-yellow-300">1 hidden Golden Fruit (+500 pts)</strong> and a <strong className="text-sky-300">Secret Area</strong> hidden behind leafy vines and elevated treetops. Collect all 3 across the adventure to achieve full garden restoration!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-800 border-t-2 border-stone-700 flex justify-end">
          <button
            id="got-it-btn"
            onClick={onClose}
            className="py-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-lg border-2 border-emerald-300 shadow pixel-btn cursor-pointer"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
