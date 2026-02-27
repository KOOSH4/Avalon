
import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GamePhase } from './types';
import PlayerSetup from './components/PlayerSetup';
import RoleReveal from './components/RoleReveal';
import GameBoard from './components/GameBoard';
import RulesAndFaq from './components/RulesAndFaq';
import { GameIcon } from './constants';
import RoleGuide from './components/RoleGuide';
import NarratedNight from './components/NarratedNight';
import QRCodeModal from './components/QRCodeModal';

export default function App(): React.ReactNode {
  const gameLogic = useGameLogic();
  const { gameState } = gameLogic;
  const [showRules, setShowRules] = useState(false);
  const [showRoleGuide, setShowRoleGuide] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const activeRoleList = gameState.players.map(p => p.role);

  const renderPhase = () => {
    switch (gameState.phase) {
      case GamePhase.SETUP:
        return <PlayerSetup onSetupComplete={gameLogic.setupGame} />;
      case GamePhase.ROLE_REVEAL:
        return <RoleReveal {...gameLogic} />;
      case GamePhase.NARRATED_NIGHT:
        return <NarratedNight {...gameLogic} />;
      default:
        return <GameBoard {...gameLogic} />;
    }
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col items-center p-2 relative font-sans safe-top">
        {/* Top Navigation Bar: Avalon on Top-Right, Buttons on Top-Left (in RTL context) */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+8px)] left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
            {/* Title & Icon on the Top-Right (First in RTL) */}
            <div className="flex items-center gap-2 text-yellow-400 pointer-events-auto bg-slate-900/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div className="text-2xl drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] flex items-center justify-center">
                    {GameIcon}
                </div>
                <h1 className="text-xl font-lalezar tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" style={{textShadow: '0 0 10px rgba(250, 204, 21, 0.4)'}}>پرونده شرلوک</h1>
            </div>

            {/* Buttons on the Top-Left (Second in RTL) */}
            <div className="flex gap-1.5 pointer-events-auto">
                <button
                    onClick={() => setShowQRCode(true)}
                    className="bg-amber-400/20 hover:bg-amber-400/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
                    title="اشتراک‌گذاری"
                >
                    <span className="text-lg">📱</span>
                </button>
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
                <button
                    onClick={gameLogic.resetGame}
                    className="bg-rose-600/20 hover:bg-rose-500/40 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-90 backdrop-blur-xl border border-white/20"
                    title="شروع مجدد"
                >
                    <span className="text-lg">🔄</span>
                </button>
            </div>
        </div>

      {/* Main Container - Adjusted margin top for safe area and navigation */}
      <div className="flex-1 w-full mt-20 bg-slate-950/60 rounded-t-[3.5rem] rounded-b-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-3xl border border-white/10 p-4 mb-[calc(env(safe-area-inset-bottom)+12px)] overflow-hidden relative">
        {showRules ? (
            <RulesAndFaq onClose={() => setShowRules(false)} />
        ) : showRoleGuide ? (
            <RoleGuide activeRoles={activeRoleList} onClose={() => setShowRoleGuide(false)} />
        ) : (
            renderPhase()
        )}
      </div>

      {showQRCode && <QRCodeModal onClose={() => setShowQRCode(false)} />}
    </div>
  );
}
