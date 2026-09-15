import React from 'react';
import { Play, RotateCcw, List, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onLevelSelect,
  isMuted,
  onToggleMute
}) => {
  return (
    <div id="pause-modal" className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none pointer-events-auto">
      <div className="w-full max-w-sm bg-stone-900 border-3 border-stone-600 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
        <h2 className="font-pixel text-xl text-amber-300 tracking-wider mb-6">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-3 w-full">
          <button
            id="pause-resume-btn"
            onClick={onResume}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-xl border-2 border-emerald-300 shadow flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <Play size={14} className="fill-white" />
            <span>RESUME</span>
          </button>

          <button
            id="pause-restart-btn"
            onClick={onRestart}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs rounded-xl border-2 border-stone-600 shadow flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>RESTART LEVEL</span>
          </button>

          <button
            id="pause-level-select-btn"
            onClick={onLevelSelect}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs rounded-xl border-2 border-stone-600 shadow flex items-center justify-center gap-2 pixel-btn cursor-pointer"
          >
            <List size={14} />
            <span>LEVEL SELECT</span>
          </button>

          <button
            id="pause-mute-btn"
            onClick={onToggleMute}
            className="w-full py-2.5 mt-2 bg-stone-950/70 hover:bg-stone-900 text-stone-400 hover:text-white font-pixel text-[10px] rounded-lg border border-stone-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'UNMUTE SOUND' : 'MUTE SOUND'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
