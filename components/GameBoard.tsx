
import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GamePhase, Player, QuestResult, Team } from '../types';
import { CrownIcon } from '../constants';
import PrivacyScreen from './PrivacyScreen';
import Modal from './Modal';

type GameBoardProps = ReturnType<typeof useGameLogic>;

function shuffleArray<T,>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { gameState } = props;

  const renderContent = () => {
    switch (gameState.phase) {
      case GamePhase.TEAM_PROPOSAL:
        return <TeamProposal {...props} />;
      case GamePhase.TEAM_VOTE:
        return <TeamVote {...props} />;
      case GamePhase.QUEST_EXECUTION:
          return <QuestExecution {...props} />;
      case GamePhase.QUEST_RESULT:
          return <QuestResultDisplay {...props} />;
      case GamePhase.ASSASSINATION:
        return <Assassination {...props} />;
      case GamePhase.GAME_OVER:
        return <GameOver {...props} />;
      default:
        return <div className="text-center text-xl text-yellow-500 animate-pulse font-bold mt-20">در حال احضار مرحله بعد... 🧙‍♂️</div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
      <Scoreboard {...props} />
      <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar mt-2">
        {renderContent()}
      </div>
    </div>
  );
};

const Scoreboard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { players, quests, currentLeaderIndex, voteTrack } = gameState;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-800/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-xl">
        <h3 className="text-xs font-black text-yellow-500 tracking-widest uppercase ml-2">مأموریت‌ها</h3>
        <div className="flex gap-2">
          {quests.map(q => (
            <div key={q.id} className={`w-11 h-11 rounded-full flex items-center justify-center border-2 text-xl font-black transition-all transform hover:scale-110 ${
                q.result === QuestResult.PENDING ? 'border-gray-600 bg-gray-800/50 text-gray-500' :
                q.result === QuestResult.SUCCESS ? 'border-blue-400 bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 
                'border-red-400 bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
            }`}>
              {q.result === QuestResult.SUCCESS ? '✨' : q.result === QuestResult.FAIL ? '💥' : q.teamSize}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/30 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[10px] text-gray-400 font-black mb-1.5 uppercase tracking-widest">پیشوا</span>
            <div className="flex items-center gap-2">
                <span className="text-white font-black truncate max-w-[90px] text-lg">{players[currentLeaderIndex].name}</span>
                {CrownIcon}
            </div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[10px] text-gray-400 font-black mb-1.5 uppercase tracking-widest">رد تیمی</span>
            <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${i < voteTrack ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]' : 'bg-gray-700'}`}></div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

const TeamProposal: React.FC<GameBoardProps> = ({ gameState, selectTeamMember, proposeTeam }) => {
    const { players, currentQuestTeam, gameMessage, quests, currentRound } = gameState;
    const requiredSize = quests[currentRound].teamSize;
    const canPropose = currentQuestTeam.length === requiredSize;

    return (
        <div className="text-center flex flex-col h-full">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-[1.5rem] mb-4 shadow-inner">
                <p className="text-yellow-400 text-sm font-bold leading-relaxed">{gameMessage}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-grow overflow-y-auto pr-1 py-2">
                {players.map(p => {
                    const isSelected = currentQuestTeam.some(sp => sp.id === p.id);
                    return (
                        <button key={p.id} onClick={() => selectTeamMember(p)}
                            className={`p-5 rounded-[1.5rem] text-lg font-black transition-all duration-300 transform
                            ${isSelected ? 'bg-green-600 text-white shadow-xl shadow-green-900/40 ring-2 ring-white/40 scale-105' : 'bg-gray-800/40 hover:bg-gray-700/60 text-gray-300 border border-white/5 shadow-md'}`}>
                            {p.name} {isSelected ? '✅' : ''}
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-4">
                <button onClick={proposeTeam} disabled={!canPropose}
                    className={`w-full p-5 rounded-[1.8rem] text-2xl font-lalezar transition-all shadow-2xl
                    ${!canPropose ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-slate-950 active:scale-95 border-t border-white/30'}`}>
                    {canPropose ? 'نهایی کردن تیم ⚔️' : `انتخاب ${requiredSize} نفر`}
                </button>
            </div>
        </div>
    );
};

const TeamVote: React.FC<GameBoardProps> = ({ gameState, handleTeamVote }) => {
    const { currentQuestTeam, players, currentLeaderIndex } = gameState;
    const leader = players[currentLeaderIndex];

    return (
        <div className="w-full h-full flex flex-col items-center justify-between text-center p-2">
            <div className="mt-4">
                <div className="text-7xl mb-6">⚖️</div>
                <h2 className="text-3xl font-lalezar text-yellow-500 mb-2">رأی‌گیری عمومی</h2>
                <p className="text-gray-400 text-sm font-bold">{leader.name} این تیم را پیشنهاد داده است</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 w-full max-w-sm shadow-2xl">
                <div className="flex flex-wrap gap-3 justify-center">
                    {currentQuestTeam.map(p => (
                        <span key={p.id} className="px-5 py-2.5 bg-yellow-500 text-slate-950 rounded-full font-black text-sm shadow-lg border-t border-white/30">
                            {p.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-sm space-y-6 mb-4">
                <p className="text-2xl font-black text-white">آیا با این ترکیب موافقید؟</p>
                <div className="flex gap-4">
                    <button onClick={() => handleTeamVote(true)} className="flex-1 p-6 text-xl font-black bg-blue-600 hover:bg-blue-500 text-white rounded-[1.8rem] shadow-2xl shadow-blue-900/50 transition-all active:scale-90 border-t border-white/20">
                        موافق 👍
                    </button>
                    <button onClick={() => handleTeamVote(false)} className="flex-1 p-6 text-xl font-black bg-rose-600 hover:bg-rose-500 text-white rounded-[1.8rem] shadow-2xl shadow-rose-900/50 transition-all active:scale-90 border-t border-white/20">
                        مخالف 👎
                    </button>
                </div>
                <p className="text-gray-500 text-xs italic font-bold">رأی‌ها را بصورت همزمان و علنی اعلام کنید</p>
            </div>
        </div>
    );
};

const QuestExecution: React.FC<GameBoardProps> = ({ gameState, submitQuestOutcome }) => {
    const activePlayerOnTeam = gameState.currentQuestTeam.find(p => p.id === gameState.players[gameState.activePlayerIndex]?.id);
   
    if (!activePlayerOnTeam) {
        return <div className="text-center p-4 text-gray-500 italic mt-20">در انتظار نوبت...</div>;
    }

    const currentPlayer = activePlayerOnTeam;
    const canFail = currentPlayer.team === Team.Evil;

    const QuestScreen: React.FC = () => (
         <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-slate-950/90 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-3xl">
            <div className="mt-8">
                <div className="text-8xl mb-6 animate-pulse">⚡</div>
                <h2 className="text-3xl font-lalezar text-yellow-500 mb-2">سرنوشت مأموریت</h2>
                <p className="text-gray-400 text-sm font-bold italic">انتخاب شما مخفی خواهد ماند</p>
            </div>

            <div className="flex flex-col w-full gap-5 max-w-xs mb-10">
                <button onClick={() => submitQuestOutcome('Success')} className="w-full p-8 text-2xl font-black bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-900/60 transition-all active:scale-95 border-t border-white/20">
                    ✨ پیروزی
                </button>
                <button 
                    onClick={() => submitQuestOutcome('Fail')} 
                    disabled={!canFail} 
                    className={`w-full p-8 text-2xl font-black rounded-[2rem] shadow-2xl transition-all active:scale-95 border-t border-white/10
                    ${!canFail ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' : 'bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-900/60'}`}>
                    💥 شکست
                </button>
                {!canFail && <p className="mt-2 text-[10px] text-blue-400/70 font-black tracking-widest text-center uppercase">نیروهای نیکی فقط می‌توانند پیروزی را انتخاب کنند</p>}
            </div>
        </div>
    )

    return (
         <PrivacyScreen 
            key={currentPlayer.id} 
            message={`گوشی را به ${currentPlayer.name} بدهید`} 
            buttonText="ورود به تالار سرنوشت" 
            onContinue={() => {}}
        >
            <QuestScreen />
        </PrivacyScreen>
    )
}

const QuestResultDisplay: React.FC<GameBoardProps> = ({ gameState, processQuestResult }) => {
    const { quests, currentRound, temporaryQuestOutcomes } = gameState;
    const currentQuest = quests[currentRound];
    const outcomes = React.useMemo(() => shuffleArray(temporaryQuestOutcomes), [temporaryQuestOutcomes]);

    const failCount = outcomes.filter(o => o === 'Fail').length;
    const didFail = failCount >= currentQuest.failsRequired;

    return (
        <Modal title={`نتیجه مأموریت ${currentRound + 1}`} onClose={processQuestResult} buttonText="ادامه نبرد ⚔️">
             <div className="text-center py-4">
                <div className={`text-8xl mb-8 transition-transform hover:scale-110 duration-700`}>
                    {didFail ? '🌑' : '☀️'}
                </div>
                
                <h3 className={`text-3xl font-black mb-6 ${didFail ? 'text-rose-500' : 'text-blue-400'}`}>
                    {didFail ? 'مأموریت با شکست مواجه شد!' : 'مأموریت با موفقیت انجام شد!'}
                </h3>

                <div className="flex flex-col items-center gap-5 my-10 bg-black/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">کارت‌های بازی شده</p>
                    <div className="flex justify-center gap-4">
                        {outcomes.map((o, i) => (
                            <div key={i} className={`w-16 h-24 rounded-2xl flex items-center justify-center text-4xl border-2 shadow-2xl animate-fade-in transform
                                ${o === 'Success' ? 'bg-blue-600/30 border-blue-500/50 text-blue-400 rotate-2' : 'bg-rose-600/30 border-rose-500/50 text-rose-400 -rotate-2'}`} 
                                style={{animationDelay: `${i * 350}ms`}}>
                                {o === 'Success' ? '✨' : '💥'}
                            </div>
                        ))}
                    </div>
                </div>

                 <p className="text-sm text-gray-400 leading-relaxed font-bold">
                    در این مرحله <span className="font-black text-rose-500 mx-1 text-lg">{failCount}</span> کارت شکست رو شد.
                    {didFail && <span className="block mt-1 opacity-80 text-xs">شروران در این منطقه نفوذ کردند.</span>}
                 </p>
            </div>
        </Modal>
    );
}

const Assassination: React.FC<GameBoardProps> = ({ gameState, assassinate }) => {
    const { players, assassin } = gameState;
    const [targetToConfirm, setTargetToConfirm] = React.useState<Player | null>(null);
    const potentialTargets = players.filter(p => p.team === Team.Good);

    if (targetToConfirm) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-rose-950/40 backdrop-blur-2xl border border-rose-500/30 rounded-[3rem] animate-fade-in shadow-3xl">
                <div className="text-7xl mb-8">🎯</div>
                <h3 className="text-3xl font-lalezar text-white mb-4">تایید سوءقصد</h3>
                <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                    آیا اطمینان دارید که <span className="font-black text-rose-400 px-3 py-1 bg-black/60 rounded-xl border border-rose-500/30">{targetToConfirm.name}</span> مرلین واقعی است؟
                </p>
                <div className="flex w-full gap-4 max-w-xs">
                    <button 
                        onClick={() => assassinate(targetToConfirm)} 
                        className="flex-1 p-5 text-xl font-black bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] shadow-2xl shadow-rose-900/60 active:scale-95 transition-all border-t border-white/20">
                        بله، بکش!
                    </button>
                    <button 
                        onClick={() => setTargetToConfirm(null)} 
                        className="flex-1 p-5 text-xl font-black bg-gray-900/80 text-gray-300 rounded-[1.5rem] border border-white/10 active:scale-95 transition-all">
                        صبر کن...
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="text-center flex flex-col h-full">
            <div className="mb-8 mt-2">
                <div className="text-7xl mb-6">🗡️</div>
                <h2 className="text-3xl font-lalezar text-rose-500 mb-2">لحظه انتقام</h2>
                <p className="text-gray-400 text-sm font-bold italic">آدمکش ({assassin?.name})، مرلین را هدف بگیر!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-grow overflow-y-auto pr-1 py-2">
                {potentialTargets.map(p => (
                    <button key={p.id} onClick={() => setTargetToConfirm(p)}
                        className="p-6 rounded-[2rem] text-lg font-black bg-gray-800/60 hover:bg-rose-900/40 text-gray-200 border border-white/5 transition-all hover:border-rose-500/50 shadow-xl">
                        {p.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const GameOver: React.FC<GameBoardProps> = ({ gameState, resetGame }) => {
    const { winner, gameMessage, players } = gameState;
    const isGoodWins = winner === Team.Good;

    return (
        <Modal title="سرانجام نبرد" onClose={resetGame} buttonText="بازگشت به منوی اصلی 🏰">
            <div className="text-center py-2">
                <div className="text-8xl mb-8 drop-shadow-3xl transform hover:scale-110 transition-transform">
                    {isGoodWins ? '🏆' : '🔥'}
                </div>
                
                <h3 className={`text-4xl font-lalezar mb-4 ${isGoodWins ? 'text-blue-400' : 'text-rose-500'}`} style={{ textShadow: `0 0 25px ${isGoodWins ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)'}` }}>
                    {isGoodWins ? 'نیکان پیروز شدند!' : 'شروران پیروز شدند!'}
                </h3>
                
                <p className="text-base text-yellow-500 font-bold mb-8 bg-yellow-500/10 py-4 px-6 rounded-[1.5rem] border border-yellow-500/20">{gameMessage}</p>
                
                <div className="space-y-3 text-right max-h-[35vh] overflow-y-auto custom-scrollbar pr-3">
                    <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] text-center uppercase mb-3">افشای هویت‌ها</p>
                     {players.map(p => (
                        <div key={p.id} className={`flex justify-between items-center p-4 rounded-[1.5rem] border ${p.team === Team.Good ? 'bg-blue-900/20 border-blue-500/20 shadow-blue-900/10' : 'bg-rose-900/20 border-rose-500/20 shadow-rose-900/10'} shadow-md mb-2`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{p.team === Team.Good ? '😇' : '😈'}</span>
                                <span className={`font-black ${p.team === Team.Good ? 'text-blue-300' : 'text-rose-300'} text-base`}>{p.name}</span>
                            </div>
                            <span className="font-bold text-gray-400 text-xs tracking-tight">{p.role}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default GameBoard;
