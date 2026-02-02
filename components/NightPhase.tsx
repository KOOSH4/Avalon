
import React from 'react';
import PrivacyScreen from './PrivacyScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { ROLE_DATA, STRINGS_FA } from '../constants';
import { Team } from '../types';

type NightPhaseProps = ReturnType<typeof useGameLogic>;

const NightPhase: React.FC<NightPhaseProps> = ({ gameState, advanceNightPhase }) => {
  const { players, privateActionStep } = gameState;
  
  const currentPlayer = players[privateActionStep];

  if (!currentPlayer) {
    return null;
  }

  const roleInfo = ROLE_DATA[currentPlayer.role];
  const knowledgeText = roleInfo.knowledge(players, currentPlayer);
  const teamColor = currentPlayer.team === Team.Good ? 'text-blue-400' : 'text-red-400';
  const teamBorder = currentPlayer.team === Team.Good ? 'border-blue-500/50' : 'border-red-500/50';
  const teamIcon = currentPlayer.team === Team.Good ? '😇' : '😈';

  const NightKnowledgeCard: React.FC = () => (
    <div className={`w-full max-w-sm p-4 bg-gray-900/70 backdrop-blur-lg border-2 ${teamBorder} rounded-3xl shadow-2xl flex flex-col items-center text-center animate-fade-in`}>
        <h2 className="text-3xl font-bold text-indigo-300 mb-4" style={{textShadow: '0 0 5px #a5b4fc'}}>فاز شب 🌙</h2>
        
        {roleInfo.image ? (
            <div className={`w-32 h-32 mb-3 rounded-full overflow-hidden border-4 ${teamBorder} shadow-lg`}>
                <img src={roleInfo.image} alt={roleInfo.name} className="w-full h-full object-cover" />
            </div>
        ) : (
            <div className={`w-32 h-32 mb-3 rounded-full bg-gray-800 border-4 ${teamBorder} flex items-center justify-center`}>
              <span className="text-5xl">{teamIcon}</span>
            </div>
        )}
        
        <p className="text-2xl font-semibold text-yellow-300 mb-4">{currentPlayer.name}</p>
        
        <div className="w-full bg-black/40 p-3 rounded-xl mb-4 text-right">
            <p className="text-lg">
                <span className="font-bold text-yellow-400">نقش:</span>
                <span className={`font-bold ${teamColor}`}>{` ${roleInfo.name}`}</span>
            </p>
            <p>
                <span className="font-bold text-yellow-400">تیم:</span>
                <span className={teamColor}>{` ${currentPlayer.team} ${teamIcon}`}</span>
            </p>
        </div>
        
        <div className="w-full bg-black/40 p-4 rounded-xl">
            <p className="font-bold text-xl text-yellow-300 mb-2 text-center">👁️ دانایی شما 👁️</p>
            <div className="text-gray-200 text-lg min-h-[5rem] flex items-center justify-center text-center leading-relaxed p-2 bg-gray-900/50 rounded-lg">
                {knowledgeText}
            </div>
        </div>

        <p className="text-gray-400 mt-6 text-sm">این اطلاعات را به خاطر بسپارید. برای ادامه ضربه بزنید.</p>
    </div>
  );
  
  const isLastStep = privateActionStep === players.length - 1;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <PrivacyScreen
        message={STRINGS_FA.passTo.replace('{player}', currentPlayer.name)}
        buttonText="برای دیدن اطلاعات خود ضربه بزنید"
        onContinue={advanceNightPhase}
      >
        <NightKnowledgeCard />
        {isLastStep && <p className="mt-4 text-yellow-400 animate-pulse">فاز شب به پایان رسید. بازی آغاز می‌شود.</p>}
      </PrivacyScreen>
    </div>
  );
};

export default NightPhase;