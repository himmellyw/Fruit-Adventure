import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJumpStart,
  onJumpEnd
}) => {
  return (
    <div
      id="touch-controls-container"
      className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30 select-none md:opacity-40 hover:opacity-100 transition-opacity"
    >
      {/* Direction Pad (Left / Right) */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          id="touch-btn-left"
          onTouchStart={(e) => { e.preventDefault(); onLeftStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onLeftEnd(); }}
          onMouseDown={onLeftStart}
          onMouseUp={onLeftEnd}
          onMouseLeave={onLeftEnd}
          className="w-16 h-16 bg-stone-800/85 active:bg-stone-700 text-stone-200 border-3 border-stone-600 active:border-amber-400 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          aria-label="Move Left"
        >
          <ArrowLeft size={30} />
        </button>

        <button
          id="touch-btn-right"
          onTouchStart={(e) => { e.preventDefault(); onRightStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onRightEnd(); }}
          onMouseDown={onRightStart}
          onMouseUp={onRightEnd}
          onMouseLeave={onRightEnd}
          className="w-16 h-16 bg-stone-800/85 active:bg-stone-700 text-stone-200 border-3 border-stone-600 active:border-amber-400 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          aria-label="Move Right"
        >
          <ArrowRight size={30} />
        </button>
      </div>

      {/* Jump Button */}
      <div className="pointer-events-auto">
        <button
          id="touch-btn-jump"
          onTouchStart={(e) => { e.preventDefault(); onJumpStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onJumpEnd(); }}
          onMouseDown={onJumpStart}
          onMouseUp={onJumpEnd}
          onMouseLeave={onJumpEnd}
          className="w-20 h-20 bg-emerald-700/85 active:bg-emerald-600 text-white border-3 border-emerald-400 active:border-emerald-200 rounded-2xl flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform cursor-pointer font-pixel text-[10px]"
          aria-label="Jump"
        >
          <ArrowUp size={30} />
          <span className="mt-0.5 font-bold">JUMP</span>
        </button>
      </div>
    </div>
  );
};
