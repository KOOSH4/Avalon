
import React from 'react';
import PrivacyScreen from './PrivacyScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { ROLE_DATA, STRINGS_FA } from '../constants';
import { Team, Player } from '../types';

type RoleRevealProps = ReturnType<typeof useGameLogic>;

const RoleCard: React.FC<{ player: Player, allPlayers: Player[] }> = ({ player, allPlayers }) => {
  const roleInfo = ROLE_DATA[player.role];
  const knowledgeText = roleInfo.knowledge(allPlayers, player);
  
  // Neutral security theme (No red/blue colors on main background)
  const teamColor = player.team === Team.Good ? 'text-blue-400' : 'text-red-400';
  const neutralBg = 'bg-slate-900/90';
  const neutralBorder = 'border-gray-700';

  return (
    <div className={`w-full max-w-sm p-6 ${neutralBg} backdrop-blur-3xl border-2 ${neutralBorder} rounded-[2.5rem] shadow-2xl flex flex-col items-center text-right animate-fade-in`}>
      
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-inner bg-slate-800 flex items-center justify-center">
            {roleInfo.image ? (
                <img src={roleInfo.image} alt="" className="w-20 h-20 object-contain" />
            ) : (
                <span className="text-5xl">{player.team === Team.Good ? '😇' : '😈'}</span>
            )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
           {player.name}
        </div>
      </div>

      <div className="w-full space-y-1 mb-6 text-center">
        <h2 className={`text-4xl font-black text-gray-100 tracking-tighter`}>
          {roleInfo.name}
        </h2>
        <p className={`${teamColor} font-bold tracking-widest text-sm uppercase`}>تیم {player.team}</p>
      </div>
      
      <div className="w-full bg-black/40 p-5 rounded-3xl mb-4 border border-white/5">
        <p className="text-base text-gray-200 leading-relaxed font-medium">
          {roleInfo.description}
        </p>
      </div>

      <div className="w-full bg-gray-800/50 p-5 rounded-3xl border border-white/10">
        <p className="font-black text-center text-yellow-500 mb-3 text-xs tracking-widest border-b border-white/10 pb-2">
           دانش نهفته شما
        </p>
        <div className="text-gray-100 text-lg text-center leading-relaxed">
            {knowledgeText}
        </div>
      </div>
      
      <div className="mt-8 opacity-40">
        <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">برای بازگشت و پنهان کردن نقش ضربه بزنید</p>
      </div>
    </div>
  );
};

const RoleReveal: React.FC<RoleRevealProps> = ({ gameState, advanceRoleReveal }) => {
  const { players, activePlayerIndex } = gameState;
  const currentPlayer = players[activePlayerIndex];
  const isLastPlayer = activePlayerIndex === players.length - 1;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <PrivacyScreen
        message={STRINGS_FA.passTo.replace('{player}', currentPlayer.name)}
        buttonText={STRINGS_FA.tapToReveal}
        onContinue={advanceRoleReveal}
      >
        <RoleCard player={currentPlayer} allPlayers={players} />
        {isLastPlayer && (
            <div className="absolute bottom-10 px-6 py-2 bg-yellow-600 rounded-full text-white font-black animate-pulse shadow-xl">
               شما آخرین نفر هستید!
            </div>
        )}
      </PrivacyScreen>
    </div>
  );
};

export default RoleReveal;
