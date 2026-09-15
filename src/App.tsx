import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { audio } from './game/audio';
import { BossState, GameScreen, PowerUpState, SaveProgress } from './game/types';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // App & Game UI state
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // HUD stats
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [fruitsCollected, setFruitsCollected] = useState<number>(0);
  const [totalFruits, setTotalFruits] = useState<number>(10);
  const [goldenFruit, setGoldenFruit] = useState<boolean>(false);
  const [activePower, setActivePower] = useState<PowerUpState | null>(null);
  const [comboCount, setComboCount] = useState<number>(0);
  const [bossState, setBossState] = useState<BossState | null>(null);

  // Game over / victory stats
  const [lastLevelId, setLastLevelId] = useState<number>(1);
  const [allGoldenFruitsFound, setAllGoldenFruitsFound] = useState<boolean>(false);
  const [levelCompleteMessage, setLevelCompleteMessage] = useState<string | null>(null);

  // Progress state for UI
  const [progress, setProgress] = useState<SaveProgress>({
    unlockedLevels: 1,
    goldenFruits: [false, false, false],
    highScores: [0, 0, 0],
    gardenRestored: false
  });

  // Setup callbacks
  const handleScoreChange = useCallback((newScore: number) => setScore(newScore), []);
  const handleLivesChange = useCallback((newLives: number) => setLives(newLives), []);
  const handleFruitChange = useCallback((col: number, tot: number) => {
    setFruitsCollected(col);
    setTotalFruits(tot);
  }, []);
  const handleGoldenFruitChange = useCallback((found: boolean) => setGoldenFruit(found), []);
  const handlePowerUpChange = useCallback((power: PowerUpState | null) => setActivePower(power), []);
  const handleComboChange = useCallback((combo: number) => setComboCount(combo), []);
  const handleBossStateChange = useCallback((boss: BossState | null) => setBossState(boss), []);

  const handleLevelComplete = useCallback((levelId: number, finalScore: number) => {
    setLevelCompleteMessage(`LEVEL ${levelId} COMPLETE!`);
    if (engineRef.current) {
      setProgress({ ...engineRef.current.progress });
    }
    setTimeout(() => {
      setLevelCompleteMessage(null);
      if (levelId < 3) {
        // Advance to next level automatically
        handleStartLevel(levelId + 1);
      } else {
        setScreen('level_select');
      }
    }, 2000);
  }, []);

  const handleGameOver = useCallback((finalScore: number, lvlId: number) => {
    setLastLevelId(lvlId);
    setScreen('game_over');
  }, []);

  const handleVictory = useCallback((finalScore: number, allGolden: boolean) => {
    setAllGoldenFruitsFound(allGolden);
    if (engineRef.current) {
      setProgress({ ...engineRef.current.progress });
    }
    setScreen('victory');
  }, []);

  // Initialize Game Engine on Canvas Mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onScoreChange: handleScoreChange,
      onLivesChange: handleLivesChange,
      onFruitChange: handleFruitChange,
      onGoldenFruitChange: handleGoldenFruitChange,
      onPowerUpChange: handlePowerUpChange,
      onComboChange: handleComboChange,
      onBossStateChange: handleBossStateChange,
      onLevelComplete: handleLevelComplete,
      onGameOver: handleGameOver,
      onVictory: handleVictory
    });

    engineRef.current = engine;
    setProgress({ ...engine.progress });
    engine.start();

    // Start menu chiptune
    audio.playBGM('menu');

    return () => {
      engine.stop();
      audio.stopBGM();
    };
  }, [
    handleScoreChange,
    handleLivesChange,
    handleFruitChange,
    handleGoldenFruitChange,
    handlePowerUpChange,
    handleComboChange,
    handleBossStateChange,
    handleLevelComplete,
    handleGameOver,
    handleVictory
  ]);

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Audio resume on first key
      audio.resume();

      const engine = engineRef.current;
      if (!engine || isPaused) return;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        engine.keys.left = true;
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        engine.keys.right = true;
      } else if (e.code === 'KeyW' || e.code === 'Space' || e.code === 'ArrowUp') {
        engine.keys.jump = true;
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (screen === 'playing') {
          setIsPaused((prev) => !prev);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        engine.keys.left = false;
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        engine.keys.right = false;
      } else if (e.code === 'KeyW' || e.code === 'Space' || e.code === 'ArrowUp') {
        engine.keys.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, isPaused]);

  // Actions
  const handleStartLevel = (levelId: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    audio.resume();
    setLastLevelId(levelId);
    setScreen('playing');
    setIsPaused(false);
    engine.startLevel(levelId);
  };

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleRestartCurrentLevel = () => {
    setIsPaused(false);
    handleStartLevel(lastLevelId);
  };

  const handleReturnToMainMenu = () => {
    setIsPaused(false);
    setScreen('menu');
    audio.playBGM('menu');
    if (engineRef.current) {
      engineRef.current.currentScreen = 'menu';
    }
  };

  return (
    <div className="relative w-screen h-screen bg-stone-950 flex items-center justify-center overflow-hidden">
      {/* Game Screen Container with fixed 4:3 Aspect Ratio and crisp pixel rendering */}
      <div
        id="game-viewport"
        className="relative w-full h-full max-w-[1000px] max-h-[750px] aspect-[4/3] bg-black shadow-2xl overflow-hidden flex items-center justify-center border-0 sm:border-4 border-stone-800 rounded-none sm:rounded-2xl"
      >
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain pixel-art block"
        />

        {/* In-Game HUD (Visible during gameplay) */}
        {screen === 'playing' && (
          <HUD
            score={score}
            lives={lives}
            maxLives={4}
            fruitsCollected={fruitsCollected}
            totalFruits={totalFruits}
            goldenFruitCollected={goldenFruit}
            levelName={engineRef.current?.currentLevel.name || 'LEVEL 1'}
            levelSubtitle={engineRef.current?.currentLevel.subtitle || 'SUNNY GARDEN'}
            comboCount={comboCount}
            activePower={activePower}
            boss={bossState}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={() => setIsPaused(true)}
          />
        )}

        {/* Level Complete Floating Banner */}
        {levelCompleteMessage && (
          <div className="absolute inset-0 z-35 flex items-center justify-center pointer-events-none">
            <div className="bg-emerald-600 border-4 border-yellow-300 text-white font-pixel text-lg md:text-2xl px-8 py-5 rounded-2xl shadow-2xl animate-bounce tracking-wider">
              {levelCompleteMessage}
            </div>
          </div>
        )}

        {/* Touch Controls (Mobile/Tablet and active on screen playing) */}
        {screen === 'playing' && !isPaused && (
          <TouchControls
            onLeftStart={() => {
              if (engineRef.current) engineRef.current.keys.left = true;
            }}
            onLeftEnd={() => {
              if (engineRef.current) engineRef.current.keys.left = false;
            }}
            onRightStart={() => {
              if (engineRef.current) engineRef.current.keys.right = true;
            }}
            onRightEnd={() => {
              if (engineRef.current) engineRef.current.keys.right = false;
            }}
            onJumpStart={() => {
              if (engineRef.current) engineRef.current.keys.jump = true;
            }}
            onJumpEnd={() => {
              if (engineRef.current) engineRef.current.keys.jump = false;
            }}
          />
        )}

        {/* Splash / Main Menu */}
        {screen === 'menu' && (
          <MainMenu
            progress={progress}
            isMuted={isMuted}
            onStart={() => setScreen('level_select')}
            onHowToPlay={() => setShowHowToPlay(true)}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* Level Select Screen */}
        {screen === 'level_select' && (
          <LevelSelect
            progress={progress}
            onSelectLevel={handleStartLevel}
            onBack={() => setScreen('menu')}
          />
        )}

        {/* How to Play Modal */}
        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}

        {/* Pause Modal */}
        {isPaused && screen === 'playing' && (
          <PauseModal
            onResume={() => setIsPaused(false)}
            onRestart={handleRestartCurrentLevel}
            onLevelSelect={() => {
              setIsPaused(false);
              setScreen('level_select');
              audio.playBGM('menu');
            }}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* Game Over Screen */}
        {screen === 'game_over' && (
          <GameOverModal
            score={score}
            levelId={lastLevelId}
            fruitsCollected={fruitsCollected}
            totalFruits={totalFruits}
            goldenFruit={goldenFruit}
            onRestart={handleRestartCurrentLevel}
            onMainMenu={handleReturnToMainMenu}
          />
        )}

        {/* Victory Screen */}
        {screen === 'victory' && (
          <VictoryModal
            score={score}
            allGoldenFruits={allGoldenFruitsFound}
            onPlayAgain={() => handleStartLevel(1)}
            onMainMenu={handleReturnToMainMenu}
          />
        )}
      </div>
    </div>
  );
}
