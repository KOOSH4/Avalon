
import React, { useState, useMemo, useEffect, useCallback } from 'react';

const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
import { useGameLogic } from '../hooks/useGameLogic';
import { GamePhase, Player, QuestResult, Team } from '../types';
import { CrownIcon } from '../constants';
import PrivacyScreen from './PrivacyScreen';
import Modal from './Modal';

type GameBoardProps = ReturnType<typeof useGameLogic> & { playAgain?: () => void };

function shuffleArray<T,>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// ── Scoreboard ──────────────────────────────────────────────────────────────
const Scoreboard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { players, quests, currentLeaderIndex, voteTrack, currentRound } = gameState;
  const isDanger = voteTrack >= 3;

  const goodScore = quests.filter(q => q.result === QuestResult.SUCCESS).length;
  const evilScore = quests.filter(q => q.result === QuestResult.FAIL).length;

  return (
    <div className="space-y-3">
      {/* Quest circles */}
      <div className="flex items-center justify-between bg-gray-800/40 backdrop-blur-xl px-4 py-3 rounded-[1.8rem] border border-white/10 shadow-lg">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[9px] font-black text-yellow-500 tracking-widest uppercase">مأموریت‌ها</span>
          <div className="flex gap-1.5 text-[10px] font-black">
            <span className="text-blue-400">{goodScore} ✓</span>
            <span className="text-gray-600">|</span>
            <span className="text-red-400">{evilScore} ✗</span>
          </div>
        </div>
        <div className="flex gap-2">
          {quests.map((q, idx) => {
            const isCurrent = idx === currentRound && q.result === QuestResult.PENDING;
            return (
              <div key={q.id} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-black transition-all ${
                q.result === QuestResult.SUCCESS
                  ? 'border-blue-400 bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)] text-white text-base'
                  : q.result === QuestResult.FAIL
                  ? 'border-red-400 bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.6)] text-white text-base'
                  : isCurrent
                  ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 text-sm shadow-[0_0_10px_rgba(234,179,8,0.4)] scale-110'
                  : 'border-gray-600 bg-gray-800/50 text-gray-500 text-sm'
              }`}>
                {q.result === QuestResult.SUCCESS ? '✓' : q.result === QuestResult.FAIL ? '✗' : q.teamSize}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leader + Vote track */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800/30 backdrop-blur-xl px-4 py-3 rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center shadow-md">
          <span className="text-[9px] text-gray-400 font-black mb-1 uppercase tracking-widest">پیشوا</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-black truncate max-w-[80px] text-base">{players[currentLeaderIndex].name}</span>
            {CrownIcon}
          </div>
        </div>

        <div className={`backdrop-blur-xl px-4 py-3 rounded-[1.5rem] border flex flex-col items-center justify-center shadow-md transition-all ${
          isDanger ? 'bg-rose-950/40 border-rose-500/40' : 'bg-gray-800/30 border-white/10'
        }`}>
          <span className={`text-[9px] font-black mb-1 uppercase tracking-widest ${isDanger ? 'text-rose-400' : 'text-gray-400'}`}>
            {isDanger ? '⚠️ رد تیمی' : 'رد تیمی'}
          </span>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full border border-white/10 transition-all ${
                i < voteTrack
                  ? isDanger ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                  : 'bg-gray-700'
              }`} />
            ))}
          </div>
          {isDanger && (
            <p className="text-[9px] text-rose-400 font-black mt-1">یک رد دیگر = شکست!</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Team Proposal ────────────────────────────────────────────────────────────
const TeamProposal: React.FC<GameBoardProps> = ({ gameState, selectTeamMember, proposeTeam }) => {
  const { players, currentQuestTeam, quests, currentRound, currentLeaderIndex } = gameState;
  const requiredSize = quests[currentRound].teamSize;
  const selected = currentQuestTeam.length;
  const canPropose = selected === requiredSize;
  const leader = players[currentLeaderIndex];

  return (
    <div className="text-center flex flex-col h-full gap-3">
      {/* Leader chip */}
      <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 py-3 px-4 rounded-2xl">
        <span className="text-lg">🎖️</span>
        <span className="text-yellow-300 font-black text-base">{leader.name}</span>
        <span className="text-yellow-500/60 text-xs font-bold">انتخاب می‌کند</span>
        <span className="mr-auto bg-yellow-500/20 text-yellow-300 text-xs font-black px-2.5 py-1 rounded-full border border-yellow-500/30">
          {selected} / {requiredSize}
        </span>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-2 gap-2.5 flex-grow overflow-y-auto py-1">
        {players.map((p, idx) => {
          const isSelected = currentQuestTeam.some(sp => sp.id === p.id);
          const selOrder = currentQuestTeam.findIndex(sp => sp.id === p.id) + 1;
          return (
            <button
              key={p.id}
              onClick={() => selectTeamMember(p)}
              className={`relative p-4 rounded-2xl text-base font-black transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-lg shadow-green-900/40 ring-2 ring-white/30 scale-[1.03]'
                  : 'bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 border border-white/8'
              }`}
            >
              {p.name}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-green-700 rounded-full text-[10px] font-black flex items-center justify-center shadow">
                  {selOrder}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Propose button */}
      <button
        onClick={proposeTeam}
        disabled={!canPropose}
        className={`w-full py-5 rounded-2xl text-xl font-lalezar transition-all shadow-2xl active:scale-95 ${
          !canPropose
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
            : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 shadow-[0_8px_30px_rgba(202,138,4,0.45)] border-t border-white/30 animate-pulse-once'
        }`}
      >
        {canPropose ? 'نهایی کردن تیم ⚔️' : `انتخاب ${requiredSize} نفر`}
      </button>
    </div>
  );
};

// ── Team Vote ────────────────────────────────────────────────────────────────
const TeamVote: React.FC<GameBoardProps> = ({ gameState, handleTeamVote }) => {
  const { currentQuestTeam, players, currentLeaderIndex, voteTrack } = gameState;
  const leader = players[currentLeaderIndex];
  const [phase, setPhase] = useState<'prep' | 'countdown' | 'reveal'>('prep');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) {
      const t = setTimeout(() => setPhase('reveal'), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, count]);

  const startCountdown = () => {
    setCount(3);
    setPhase('countdown');
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between text-center gap-4">
      <div className="w-full">
        <div className="text-5xl mb-3">⚖️</div>
        <h2 className="text-2xl font-lalezar text-yellow-400 mb-1">رأی‌گیری عمومی</h2>
        <p className="text-gray-400 text-xs font-bold">{leader.name} این ترکیب را پیشنهاد داده</p>
      </div>

      {/* Team chips */}
      <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 w-full shadow-xl">
        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-3">تیم پیشنهادی</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {currentQuestTeam.map(p => (
            <span key={p.id} className="px-4 py-2 bg-yellow-500 text-slate-950 rounded-full font-black text-sm shadow-md border-t border-white/30">
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Vote track reminder */}
      {voteTrack > 0 && (
        <p className="text-xs font-black text-rose-400">رد تیمی: {voteTrack} از ۵</p>
      )}

      {phase === 'prep' && (
        <div className="w-full space-y-3">
          <p className="text-gray-300 text-sm font-bold leading-relaxed">
            همه شست خود را آماده کنید —<br />
            بالا = موافق، پایین = مخالف
          </p>
          <button
            onClick={startCountdown}
            className="w-full py-5 bg-gradient-to-r from-yellow-600 to-amber-700 text-slate-950 font-lalezar text-xl rounded-2xl shadow-[0_8px_30px_rgba(202,138,4,0.4)] active:scale-95 transition-all border-t border-white/30"
          >
            همه آماده‌اند — اعلام کنید!
          </button>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="w-full flex flex-col items-center justify-center gap-2 py-2">
          <p className="text-gray-400 text-sm font-bold">آرای خود را اعلام کنید!</p>
          <div
            key={count}
            className="animate-count-pulse text-8xl font-lalezar text-yellow-400"
            style={{ textShadow: '0 0 40px rgba(250,204,21,0.7)' }}
          >
            {count === 0 ? '🎉' : count}
          </div>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="w-full space-y-3 animate-fade-in">
          <p className="text-white font-black text-lg">نتیجه رأی‌گیری چیست؟</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleTeamVote(true)}
              className="flex-1 py-5 text-xl font-black bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl shadow-blue-900/50 active:scale-90 transition-all border-t border-white/20"
            >
              اکثریت موافق 👍
            </button>
            <button
              onClick={() => handleTeamVote(false)}
              className="flex-1 py-5 text-xl font-black bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-2xl shadow-xl shadow-rose-900/50 active:scale-90 transition-all border-t border-white/20"
            >
              اکثریت مخالف 👎
            </button>
          </div>
          <p className="text-gray-600 text-[10px] italic font-bold">بر اساس اکثریت آرای علنی</p>
        </div>
      )}
    </div>
  );
};

// ── Quest Execution ──────────────────────────────────────────────────────────
const QuestExecution: React.FC<GameBoardProps> = ({ gameState, submitQuestOutcome }) => {
  const activePlayerOnTeam = gameState.currentQuestTeam.find(
    p => p.id === gameState.players[gameState.activePlayerIndex]?.id
  );

  if (!activePlayerOnTeam) {
    return <div className="text-center p-4 text-gray-500 italic mt-20">در انتظار نوبت...</div>;
  }

  const currentPlayer = activePlayerOnTeam;
  const canFail = currentPlayer.team === Team.Evil;
  const teamCount = gameState.currentQuestTeam.length;
  const doneCount = gameState.temporaryQuestOutcomes.length;

  const QuestScreenContent: React.FC = () => {
    const [voted, setVoted] = useState<'Success' | 'Fail' | null>(null);

    if (voted !== null) {
      return (
        <div className="w-full flex flex-col items-center justify-center gap-6 p-6 bg-slate-950/90 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
          <div className="text-7xl">{voted === 'Success' ? '✅' : '❌'}</div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-lalezar text-white">رأی ثبت شد</h3>
            <p className="text-gray-400 text-sm font-bold">گوشی را به نفر بعدی بدهید</p>
          </div>
          <button
            onClick={() => { haptic(30); submitQuestOutcome(voted); }}
            className="w-full max-w-xs py-5 bg-gradient-to-r from-yellow-600 to-amber-700 text-slate-950 font-lalezar text-xl rounded-2xl shadow-[0_8px_25px_rgba(202,138,4,0.4)] active:scale-95 transition-all border-t border-white/20"
          >
            تحویل دادم →
          </button>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center justify-between p-6 bg-slate-950/90 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl">
        <div className="text-center mt-4 mb-6">
          <div className="text-6xl mb-4 animate-pulse">⚡</div>
          <h2 className="text-2xl font-lalezar text-yellow-400 mb-1">سرنوشت مأموریت</h2>
          <p className="text-gray-500 text-xs font-bold">رأی {doneCount + 1} از {teamCount} — انتخاب مخفی می‌ماند</p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs mb-6">
          <button
            onClick={() => { haptic(40); setVoted('Success'); }}
            className="w-full py-7 text-2xl font-black bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[2rem] shadow-2xl shadow-blue-900/60 active:scale-95 transition-all border-t border-white/20"
          >
            ✨ پیروزی
          </button>
          <button
            onClick={() => { haptic([60, 30, 60]); setVoted('Fail'); }}
            disabled={!canFail}
            className={`w-full py-7 text-2xl font-black rounded-[2rem] shadow-2xl active:scale-95 transition-all border-t border-white/10 ${
              !canFail
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
                : 'bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-rose-900/60'
            }`}
          >
            💥 شکست
          </button>
          {!canFail && (
            <p className="text-[10px] text-blue-400/60 font-black tracking-widest text-center uppercase">
              شهروندان فقط می‌توانند پیروزی انتخاب کنند
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <PrivacyScreen
      key={currentPlayer.id}
      message={`گوشی را به ${currentPlayer.name} بدهید`}
      buttonText="ورود به تالار سرنوشت"
      onContinue={() => {}}
    >
      {() => <QuestScreenContent />}
    </PrivacyScreen>
  );
};

// ── Quest Result ─────────────────────────────────────────────────────────────
const QuestResultDisplay: React.FC<GameBoardProps> = ({ gameState, processQuestResult }) => {
  const { quests, currentRound, temporaryQuestOutcomes } = gameState;
  const currentQuest = quests[currentRound];
  const outcomes = useMemo(() => shuffleArray(temporaryQuestOutcomes), [temporaryQuestOutcomes]);
  const [canContinue, setCanContinue] = useState(false);

  const failCount = outcomes.filter(o => o === 'Fail').length;
  const didFail = failCount >= currentQuest.failsRequired;

  const goodScore = quests.filter(q => q.result === QuestResult.SUCCESS).length;
  const evilScore = quests.filter(q => q.result === QuestResult.FAIL).length;
  const projectedGood = goodScore + (didFail ? 0 : 1);
  const projectedEvil = evilScore + (didFail ? 1 : 0);

  useEffect(() => {
    const t = setTimeout(() => setCanContinue(true), 2000 + outcomes.length * 400);
    return () => clearTimeout(t);
  }, [outcomes.length]);

  return (
    <Modal
      title={`مأموریت ${currentRound + 1}`}
      onClose={processQuestResult}
      buttonText={canContinue ? 'ادامه ⚔️' : '...'}
      disabled={!canContinue}
    >
      <div className="text-center py-2 space-y-5">
        <div className="text-7xl">{didFail ? '🌑' : '☀️'}</div>

        <h3 className={`text-2xl font-lalezar ${didFail ? 'text-rose-400' : 'text-blue-400'}`}
          style={{ textShadow: `0 0 20px ${didFail ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)'}` }}>
          {didFail ? 'مأموریت ناموفق بود!' : 'مأموریت موفق بود!'}
        </h3>

        {/* Outcome cards with flip animation */}
        <div className="flex justify-center gap-3 py-4 card-flip-container">
          {outcomes.map((o, i) => (
            <div
              key={i}
              className={`card-flip w-14 h-20 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-xl ${
                o === 'Success'
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                  : 'bg-rose-600/30 border-rose-500/50 text-rose-300'
              }`}
              style={{ animationDelay: `${i * 420}ms` }}
            >
              {o === 'Success' ? '✨' : '💥'}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 font-bold">
          {failCount} کارت شکست رو شد
        </p>

        {/* Running score */}
        <div className="flex justify-center gap-6 bg-black/30 py-3 px-6 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-blue-400 font-black text-xl">{projectedGood}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">شهروندان</p>
          </div>
          <div className="text-gray-600 text-2xl font-thin self-center">—</div>
          <div className="text-center">
            <p className="text-rose-400 font-black text-xl">{projectedEvil}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">مافیا</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── Assassination ────────────────────────────────────────────────────────────
const Assassination: React.FC<GameBoardProps> = ({ gameState, assassinate }) => {
  const { players, assassin } = gameState;
  const [targetToConfirm, setTargetToConfirm] = useState<Player | null>(null);
  const potentialTargets = players.filter(p => p.team === Team.Good);

  if (targetToConfirm) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-rose-950/60 backdrop-blur-2xl border border-rose-500/40 rounded-[2.5rem] animate-fade-in shadow-[0_0_60px_rgba(239,68,68,0.2)]">
        <div className="text-6xl mb-6">🎯</div>
        <h3 className="text-2xl font-lalezar text-white mb-2">تأیید ترور</h3>
        <p className="text-gray-400 text-xs mb-6 font-bold">این آخرین فرصت شماست</p>
        <div className="bg-black/40 px-5 py-3 rounded-2xl border border-rose-500/20 mb-8">
          <p className="text-lg text-gray-200 leading-relaxed">
            آیا مطمئنید که{' '}
            <span className="font-black text-rose-300">{targetToConfirm.name}</span>{' '}
            همان شرلوک واقعی است؟
          </p>
        </div>
        <div className="flex w-full gap-3 max-w-xs">
          <button
            onClick={() => { haptic([100, 50, 100, 50, 200]); assassinate(targetToConfirm); }}
            className="flex-1 py-5 text-lg font-black bg-gradient-to-br from-rose-600 to-rose-800 text-white rounded-2xl shadow-2xl shadow-rose-900/60 active:scale-95 transition-all border-t border-white/20"
          >
            اجرای حکم 🎯
          </button>
          <button
            onClick={() => setTargetToConfirm(null)}
            className="flex-1 py-5 text-lg font-black bg-gray-900/80 text-gray-300 rounded-2xl border border-white/10 active:scale-95 transition-all"
          >
            برگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Dramatic header */}
      <div className="text-center py-4 bg-rose-950/40 rounded-2xl border border-rose-500/20">
        <div className="text-5xl mb-2">🗡️</div>
        <h2 className="text-2xl font-lalezar text-rose-400 mb-1">لحظه ترور</h2>
        <p className="text-gray-400 text-xs font-bold leading-relaxed">
          <span className="text-rose-300 font-black">{assassin?.name}</span> — قاتل حرفه‌ای<br />
          شرلوک را از میان شهروندان پیدا کنید
        </p>
      </div>

      {/* Target grid */}
      <div className="grid grid-cols-2 gap-3 flex-grow overflow-y-auto py-1">
        {potentialTargets.map(p => (
          <button
            key={p.id}
            onClick={() => setTargetToConfirm(p)}
            className="p-5 rounded-2xl text-base font-black bg-gray-800/60 hover:bg-rose-900/40 text-gray-200 border border-white/8 transition-all hover:border-rose-500/40 active:scale-95 shadow-md"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Game Over ────────────────────────────────────────────────────────────────
const GameOver: React.FC<GameBoardProps> = ({ gameState, resetGame, playAgain }) => {
  const { winner, gameMessage, players, quests } = gameState;
  const isGoodWins = winner === Team.Good;

  return (
    <Modal
      title="پایان پرونده"
      onClose={resetGame}
      buttonText="منوی اصلی 🏠"
    >
      <div className="text-center space-y-4 py-1">
        <div className="text-7xl">{isGoodWins ? '🏆' : '🔥'}</div>

        <h3
          className={`text-3xl font-lalezar ${isGoodWins ? 'text-blue-400' : 'text-rose-400'}`}
          style={{ textShadow: `0 0 20px ${isGoodWins ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)'}` }}
        >
          {isGoodWins ? 'شهروندان پیروز شدند!' : 'مافیا پیروز شد!'}
        </h3>

        <p className="text-sm text-yellow-400 font-bold bg-yellow-500/10 py-3 px-4 rounded-xl border border-yellow-500/20">
          {gameMessage}
        </p>

        {/* Quest recap */}
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2 text-center">تاریخچه مأموریت‌ها</p>
          <div className="flex gap-1.5 justify-center mb-3">
            {quests.map((q, i) => (
              <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 ${
                q.result === QuestResult.SUCCESS ? 'border-blue-400 bg-blue-600/40 text-blue-300' :
                q.result === QuestResult.FAIL ? 'border-rose-400 bg-rose-600/40 text-rose-300' :
                'border-gray-600 bg-gray-800/50 text-gray-500'
              }`}>
                {q.result === QuestResult.SUCCESS ? '✓' : q.result === QuestResult.FAIL ? '✗' : '—'}
              </div>
            ))}
          </div>
        </div>

        {/* Player reveal */}
        <div className="space-y-2 max-h-[28vh] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase text-center">افشای هویت</p>
          {players.map(p => (
            <div key={p.id} className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
              p.team === Team.Good ? 'bg-blue-900/20 border-blue-500/20' : 'bg-rose-900/20 border-rose-500/20'
            }`}>
              <div className="flex items-center gap-2">
                <span>{p.team === Team.Good ? '🔵' : '🔴'}</span>
                <span className={`font-black text-sm ${p.team === Team.Good ? 'text-blue-300' : 'text-rose-300'}`}>{p.name}</span>
              </div>
              <span className="text-gray-400 text-xs font-bold">{p.role}</span>
            </div>
          ))}
        </div>

        {/* Play again */}
        {playAgain && (
          <button
            onClick={playAgain}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-lalezar text-lg rounded-2xl shadow-[0_6px_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all border-t border-white/20"
          >
            بازی مجدد با همین بازیکنان 🔁
          </button>
        )}
      </div>
    </Modal>
  );
};

// ── Main GameBoard ───────────────────────────────────────────────────────────
const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { gameState } = props;

  const renderContent = () => {
    switch (gameState.phase) {
      case GamePhase.TEAM_PROPOSAL:   return <TeamProposal {...props} />;
      case GamePhase.TEAM_VOTE:       return <TeamVote {...props} />;
      case GamePhase.QUEST_EXECUTION: return <QuestExecution {...props} />;
      case GamePhase.QUEST_RESULT:    return <QuestResultDisplay {...props} />;
      case GamePhase.ASSASSINATION:   return <Assassination {...props} />;
      case GamePhase.GAME_OVER:       return <GameOver {...props} />;
      default:
        return <div className="text-center text-yellow-500 animate-pulse font-bold mt-20">در حال بارگذاری...</div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 animate-fade-in">
      <Scoreboard {...props} />
      <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default GameBoard;
