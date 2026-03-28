
import React from 'react';
import PrivacyScreen from './PrivacyScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { ROLE_DATA, ROLE_TAGLINES } from '../constants';
import { Team } from '../types';

type NightPhaseProps = ReturnType<typeof useGameLogic>;

const NightPhase: React.FC<NightPhaseProps> = ({ gameState, advanceNightPhase }) => {
  const { players, privateActionStep } = gameState;
  const currentPlayer = players[privateActionStep];

  if (!currentPlayer) return null;

  const roleInfo = ROLE_DATA[currentPlayer.role];
  const knowledgeText = roleInfo.knowledge(players, currentPlayer);
  const isEvil = currentPlayer.team === Team.Evil;
  const isLastStep = privateActionStep === players.length - 1;

  const teamBorder = isEvil ? 'border-red-500/50' : 'border-blue-500/40';
  const teamGlow = isEvil
    ? 'shadow-[0_0_40px_rgba(239,68,68,0.15)]'
    : 'shadow-[0_0_40px_rgba(59,130,246,0.12)]';
  const teamStrip = isEvil
    ? 'bg-gradient-to-r from-red-700 to-rose-900'
    : 'bg-gradient-to-r from-blue-700 to-indigo-800';

  const progress = `بازیکن ${privateActionStep + 1} از ${players.length}`;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-y-auto custom-scrollbar py-2">
      <PrivacyScreen
        key={currentPlayer.id}
        message={`گوشی را به ${currentPlayer.name} بدهید`}
        buttonText="مشاهده اطلاعات شب"
        onContinue={advanceNightPhase}
      >
        {(hide) => (
          <div className={`w-full max-w-sm bg-slate-900/95 border-2 ${teamBorder} rounded-[2.5rem] ${teamGlow} backdrop-blur-3xl flex flex-col items-center overflow-hidden animate-fade-in`}>
            {/* team strip */}
            <div className={`w-full h-1.5 ${teamStrip}`} />

            <div className="p-6 w-full flex flex-col items-center">
              {/* progress + badge */}
              <div className="w-full flex justify-between items-center mb-5">
                <span className="text-[10px] font-black text-gray-500 tracking-widest">{progress}</span>
                <span className="bg-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                  {currentPlayer.name}
                </span>
              </div>

              {/* night header */}
              <div className="text-center mb-5">
                <p className="text-indigo-300 font-lalezar text-2xl mb-1" style={{ textShadow: '0 0 12px rgba(165,180,252,0.5)' }}>
                  🌙 فاز شب
                </p>
                <p className="text-gray-500 text-xs">این اطلاعات را به خاطر بسپارید</p>
              </div>

              {/* avatar */}
              <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${teamBorder} bg-slate-800 flex items-center justify-center mb-4 ${teamGlow}`}>
                {roleInfo.image
                  ? <img src={roleInfo.image} alt="" className="w-16 h-16 object-contain" />
                  : <span className="text-5xl">{isEvil ? '😈' : '😇'}</span>
                }
              </div>

              {/* role identity */}
              <div className="text-center mb-5 space-y-0.5">
                <h2 className="text-2xl font-black text-white">{roleInfo.name}</h2>
                {ROLE_TAGLINES[currentPlayer.role] && (
                  <p className="text-yellow-500/70 text-[10px] font-black tracking-[0.2em] uppercase">{ROLE_TAGLINES[currentPlayer.role]}</p>
                )}
                <p className={`text-xs font-bold tracking-widest uppercase ${isEvil ? 'text-red-400' : 'text-blue-400'}`}>
                  تیم {currentPlayer.team}
                </p>
              </div>

              {/* knowledge section */}
              <div className="w-full bg-black/40 rounded-2xl p-4 border border-white/8 mb-5">
                <p className="text-[10px] font-black text-yellow-500 tracking-[0.2em] uppercase text-center mb-3 border-b border-white/10 pb-2">
                  👁️ اطلاعات شما برای این شب
                </p>
                <div className="text-gray-100 text-sm text-center leading-relaxed min-h-[3.5rem] flex items-center justify-center">
                  {knowledgeText}
                </div>
              </div>

              {/* dismiss button */}
              <button
                onClick={hide}
                className={`w-full py-4 rounded-2xl font-lalezar text-lg transition-all active:scale-95 border-t border-white/20 ${
                  isLastStep
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-[0_8px_25px_rgba(99,102,241,0.4)]'
                    : 'bg-gradient-to-r from-yellow-600 to-amber-700 text-slate-950 shadow-[0_8px_25px_rgba(202,138,4,0.35)]'
                }`}
              >
                {isLastStep ? 'پایان فاز شب — شروع بازی ☀️' : 'متوجه شدم — ادامه →'}
              </button>
            </div>
          </div>
        )}
      </PrivacyScreen>
    </div>
  );
};

export default NightPhase;
