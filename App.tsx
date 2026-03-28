
import React, { useState, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GamePhase } from './types';
import PlayerSetup from './components/PlayerSetup';
import RoleReveal from './components/RoleReveal';
import GameBoard from './components/GameBoard';
import RulesAndFaq from './components/RulesAndFaq';
import { GameIcon } from './constants';
import RoleGuide from './components/RoleGuide';
import NarratedNight from './components/NarratedNight';
import NightPhase from './components/NightPhase';
import QRCodeModal from './components/QRCodeModal';
import Modal from './components/Modal';

export default function App(): React.ReactNode {
  const gameLogic = useGameLogic();
  const { gameState } = gameLogic;
  const [showRules, setShowRules] = useState(false);
  const [showRoleGuide, setShowRoleGuide] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeRoleList = gameState.players.map(p => p.role);

  const handleResetRequest = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const handleResetConfirm = useCallback(() => {
    setShowResetConfirm(false);
    setShowRules(false);
    setShowRoleGuide(false);
    gameLogic.resetGame();
  }, [gameLogic]);

  // Play-again: re-run setup with the same player names + options
  const playAgain = useCallback(() => {
    const { players, useNarratedNight, useExpansion } = gameState;
    gameLogic.setupGame(
      players.length,
      players.map(p => p.name),
      useNarratedNight,
      useExpansion
    );
  }, [gameState, gameLogic]);

  const renderPhase = () => {
    switch (gameState.phase) {
      case GamePhase.SETUP:
        return <PlayerSetup onSetupComplete={gameLogic.setupGame} />;
      case GamePhase.ROLE_REVEAL:
        return <RoleReveal {...gameLogic} />;
      case GamePhase.NARRATED_NIGHT:
        // Route to narrated script OR per-player night phase based on toggle
        return gameState.useNarratedNight
          ? <NarratedNight {...gameLogic} />
          : <NightPhase {...gameLogic} />;
      default:
        return <GameBoard {...gameLogic} playAgain={playAgain} />;
    }
  };

  const isSetup = gameState.phase === GamePhase.SETUP;

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col items-center p-2 relative font-sans safe-top">

      {/* Top Navigation Bar */}
      <div className="absolute top-[calc(env(safe-area-inset-top)+8px)] left-4 right-4 z-50 flex items-center justify-between pointer-events-none">

        {/* Title */}
        <div className="flex items-center gap-2 text-yellow-400 pointer-events-auto bg-slate-900/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="text-2xl drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] flex items-center justify-center">
            {GameIcon}
          </div>
          <h1 className="text-xl font-lalezar tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" style={{ textShadow: '0 0 10px rgba(250,204,21,0.4)' }}>
            پرونده شرلوک
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 pointer-events-auto">
          {!isSetup && (
            <button
              onClick={() => setShowQRCode(true)}
              className="bg-amber-400/20 hover:bg-amber-400/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
              title="اشتراک‌گذاری"
            >
              <span className="text-lg">📱</span>
            </button>
          )}
          <button
            onClick={() => setShowRoleGuide(true)}
            className="bg-indigo-600/20 hover:bg-indigo-500/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
            title="راهنمای نقش‌ها"
          >
            <span className="text-lg">🎭</span>
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="bg-amber-600/20 hover:bg-amber-500/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
            title="قوانین و راهنما"
          >
            <span className="text-lg">📜</span>
          </button>
          {!isSetup && (
            <button
              onClick={handleResetRequest}
              className="bg-rose-600/20 hover:bg-rose-500/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
              title="شروع مجدد"
            >
              <span className="text-lg">🔄</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full mt-20 bg-slate-950/60 rounded-t-[3.5rem] rounded-b-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-3xl border border-white/10 p-4 mb-[calc(env(safe-area-inset-bottom)+12px)] overflow-hidden relative">
        {showRules ? (
          <RulesAndFaq onClose={() => setShowRules(false)} />
        ) : showRoleGuide ? (
          <RoleGuide activeRoles={activeRoleList} onClose={() => setShowRoleGuide(false)} />
        ) : (
          renderPhase()
        )}
      </div>

      {/* QR Modal */}
      {showQRCode && <QRCodeModal onClose={() => setShowQRCode(false)} />}

      {/* In-app Reset Confirmation */}
      {showResetConfirm && (
        <Modal
          title="بستن پرونده؟"
          onClose={() => setShowResetConfirm(false)}
          buttonText="انصراف"
        >
          <div className="text-center py-4 space-y-6">
            <div className="text-6xl">🗂️</div>
            <p className="text-gray-300 text-base leading-relaxed">
              پرونده فعلی بسته می‌شود و تمام اطلاعات بازی پاک خواهد شد.
            </p>
            <button
              onClick={handleResetConfirm}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white font-lalezar text-xl rounded-[1.5rem] shadow-[0_8px_25px_rgba(225,29,72,0.4)] active:scale-95 transition-all border-t border-white/10"
            >
              بله، پرونده را ببند
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
