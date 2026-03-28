
import React, { useState, useMemo, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { Role, Team } from '../types';

type NarratedNightProps = ReturnType<typeof useGameLogic>;

const NarratedNight: React.FC<NarratedNightProps> = ({ gameState, finishNarration }) => {
  const { players } = gameState;
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');
  const [visible, setVisible] = useState(true);

  const steps = useMemo(() => {
    const s: { text: string; subText?: string; emoji: string; color: string }[] = [];

    const evilExceptOberon = players.filter(p => p.team === Team.Evil && p.role !== Role.Oberon);
    const hasMerlin = players.some(p => p.role === Role.Merlin);
    const hasPercival = players.some(p => p.role === Role.Percival);
    const hasMorgana = players.some(p => p.role === Role.Morgana);
    const hasMordred = players.some(p => p.role === Role.Mordred);
    const hasOberon = players.some(p => p.role === Role.Oberon);
    const hasLovers = players.some(p => p.role === Role.Tristan) && players.some(p => p.role === Role.Isolde);

    s.push({
      text: 'همه چشم‌ها را ببندید.',
      subText: 'دست‌ها را روی میز بگذارید.',
      emoji: '🤫',
      color: 'text-indigo-200'
    });

    if (evilExceptOberon.length > 1) {
      const oberonWarning = hasOberon ? ' (به جز شهروند خبیث)' : '';
      s.push({
        text: `مافیا${oberonWarning} چشمانشان را باز کنند و یکدیگر را بشناسند.`,
        subText: hasOberon ? 'شهروند خبیث باید چشم‌هایش بسته بماند.' : undefined,
        emoji: '🕴️',
        color: 'text-red-400'
      });
      s.push({
        text: 'مافیا چشم‌ها را ببندید.',
        emoji: '🙈',
        color: 'text-red-300'
      });
    }

    if (hasLovers) {
      s.push({
        text: 'سربازهای صفر چشم‌ها را باز کنند و یکدیگر را بشناسند.',
        emoji: '👮‍♂️',
        color: 'text-blue-400'
      });
      s.push({
        text: 'سربازهای صفر چشم‌ها را ببندید.',
        emoji: '🙈',
        color: 'text-blue-300'
      });
    }

    if (hasMerlin) {
      const mordredWarning = hasMordred ? ' (به جز پدرخوانده)' : '';
      s.push({
        text: `مافیا${mordredWarning} شست‌های خود را بالا بیاورند.`,
        subText: hasMordred ? 'پدرخوانده شست خود را بالا نیاورد.' : undefined,
        emoji: '👍',
        color: 'text-red-400'
      });
      s.push({
        text: 'شرلوک بیدار شود و مافیا را ببیند.',
        subText: 'شرلوک، هویت مافیا را به خاطر بسپار.',
        emoji: '🕵️‍♂️',
        color: 'text-blue-400'
      });
      s.push({
        text: 'شرلوک چشم‌ها را ببندد و مافیا شست‌ها را پایین بیاورند.',
        emoji: '🙈',
        color: 'text-indigo-300'
      });
    }

    if (hasPercival) {
      const percyText = hasMorgana
        ? 'شرلوک و جاسوس شست‌های خود را بالا بیاورند.'
        : 'شرلوک شست خود را بالا بیاورد.';
      s.push({
        text: percyText,
        subText: hasMorgana ? 'واتسون نباید تشخیص دهد کدام شرلوک و کدام جاسوس است.' : undefined,
        emoji: '👍',
        color: 'text-yellow-400'
      });
      s.push({
        text: 'واتسون بیدار شود و این افراد را ببیند.',
        emoji: '🔦',
        color: 'text-blue-400'
      });
      s.push({
        text: 'واتسون چشم‌ها را ببندد و شست‌ها پایین بیایند.',
        emoji: '🙈',
        color: 'text-indigo-300'
      });
    }

    s.push({
      text: 'همه چشمانتان را باز کنید.',
      subText: 'صبح شده است و اولین عملیات در شرف آغاز است!',
      emoji: '☀️',
      color: 'text-yellow-200'
    });

    return s;
  }, [players]);

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const transition = (toStep: number, dir: 'forward' | 'back') => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(toStep);
      setVisible(true);
    }, 220);
  };

  const handleNext = () => {
    if (isLast) {
      finishNarration();
    } else {
      transition(step + 1, 'forward');
    }
  };

  const handlePrev = () => {
    if (step > 0) transition(step - 1, 'back');
  };

  const isDarkStep = currentStep.color.includes('red') || currentStep.emoji === '🙈' || currentStep.emoji === '🤫';

  return (
    <div className="w-full h-full flex flex-col items-center justify-between text-center relative overflow-hidden rounded-[2rem]"
      style={{ background: 'linear-gradient(160deg, #020617 0%, #0d0a1f 50%, #070312 100%)' }}>

      {/* Atmospheric background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[80px] opacity-20 transition-all duration-700 ${
          isDarkStep ? 'bg-indigo-900' : currentStep.color.includes('red') ? 'bg-red-900' : currentStep.color.includes('yellow') ? 'bg-yellow-900' : 'bg-blue-900'
        }`} />
      </div>

      {/* Progress dots */}
      <div className="z-10 w-full px-6 pt-4">
        <div className="flex items-center gap-1 mb-3">
          <p className="text-[10px] font-black text-indigo-400/70 tracking-[0.2em] uppercase ml-auto">یک نفر بلند بخواند</p>
        </div>
        <div className="flex justify-center gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]' :
                i < step ? 'w-3 bg-green-500/70' : 'w-2 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div
        className="z-10 flex-grow flex flex-col items-center justify-center px-6 py-4 w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : animDir === 'forward' ? 'translateX(-20px)' : 'translateX(20px)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        <div className="mb-6">
          <span className="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            {currentStep.emoji}
          </span>
        </div>

        <p className={`text-2xl font-lalezar leading-snug mb-4 ${currentStep.color}`}
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          {currentStep.text}
        </p>

        {currentStep.subText && (
          <p className="text-sm text-gray-300 font-bold bg-black/40 py-3 px-5 rounded-2xl backdrop-blur-sm border border-white/8 leading-relaxed max-w-xs">
            {currentStep.subText}
          </p>
        )}

        {/* Step counter */}
        <p className="text-[10px] text-gray-600 font-black tracking-widest uppercase mt-6">
          {step + 1} / {steps.length}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="z-10 w-full px-6 pb-4 space-y-3">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="w-16 py-4 bg-gray-900/80 hover:bg-gray-800 text-gray-300 font-black text-base rounded-2xl border border-white/10 transition-all active:scale-95"
            >
              ←
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-grow py-5 font-lalezar text-xl rounded-2xl shadow-xl transition-all active:scale-95 border-t border-white/15 ${
              isLast
                ? 'bg-gradient-to-r from-yellow-600 to-amber-700 text-slate-950 shadow-[0_8px_30px_rgba(202,138,4,0.4)]'
                : 'bg-gradient-to-r from-indigo-700 to-violet-800 text-white shadow-[0_8px_30px_rgba(99,102,241,0.3)]'
            }`}
          >
            {isLast ? 'شروع بازی ☀️' : 'مرحله بعد →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NarratedNight;
