
import React, { useState, useMemo } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { Role, Team } from '../types';

type NarratedNightProps = ReturnType<typeof useGameLogic>;

const NarratedNight: React.FC<NarratedNightProps> = ({ gameState, finishNarration }) => {
  const { players } = gameState;
  const [step, setStep] = useState(0);

  // Memoize the script generation to avoid recalculating on every render
  const steps = useMemo(() => {
    const s: { text: string; subText?: string; emoji: string; color: string }[] = [];

    const evilExceptOberon = players.filter(p => p.team === Team.Evil && p.role !== Role.Oberon);
    const hasMerlin = players.some(p => p.role === Role.Merlin);
    const hasPercival = players.some(p => p.role === Role.Percival);
    const hasMorgana = players.some(p => p.role === Role.Morgana);
    const hasMordred = players.some(p => p.role === Role.Mordred);
    const hasOberon = players.some(p => p.role === Role.Oberon);
    const hasLovers = players.some(p => p.role === Role.Tristan) && players.some(p => p.role === Role.Isolde);

    // 1. Initial Sleep
    s.push({ 
      text: 'همه چشم‌ها را ببندید.', 
      subText: 'دست‌ها را به صورت مشت روی میز بگذارید تا صدای حرکت دست بقیه را نشنوید.', 
      emoji: '🤫',
      color: 'text-indigo-200'
    });

    // 2. Evil Acknowledge (Only if there's more than 1 spy to see each other)
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

    // 3. Lovers
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

    // 4. Merlin
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

    // 5. Percival
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

    // 6. Wake up
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

  const handleNext = () => {
    if (isLast) {
      finishNarration();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between text-center p-6 bg-slate-900/40 rounded-3xl relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-64 h-64 bg-indigo-500 rounded-full animate-ping"></div>
      </div>

      <div className="z-10 w-full">
        <h2 className="text-xl font-bold text-indigo-300 mb-2">فاز شب (تأیید گروهی)</h2>
        <p className="text-gray-400 text-sm mb-6">یک نفر متن زیر را بلند بخواند</p>
        
        {/* Progress Bar */}
        <div className="flex justify-center gap-1 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? 'w-10 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 
                i < step ? 'w-4 bg-green-500' : 'w-2 bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="z-10 flex-grow flex flex-col items-center justify-center min-h-[300px] px-2">
        <div className="mb-8 transform transition-transform duration-500 hover:scale-110">
          <span className="text-8xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {currentStep.emoji}
          </span>
        </div>
        <p className={`text-3xl font-black leading-snug mb-4 ${currentStep.color}`} style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
          {currentStep.text}
        </p>
        {currentStep.subText && (
          <p className="text-lg text-gray-300 font-medium bg-black/20 py-2 px-4 rounded-full backdrop-blur-sm border border-white/5">
            {currentStep.subText}
          </p>
        )}
      </div>

      <div className="z-10 w-full space-y-4">
        <div className="flex gap-4">
           {step > 0 && (
            <button
              onClick={handlePrev}
              className="w-1/3 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-lg rounded-2xl border border-gray-600 transition-all active:scale-95"
            >
              قبلی
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-grow py-4 font-bold text-xl rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
              isLast ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-white'
            }`}
          >
            {isLast ? 'پایان و شروع بازی' : 'مرحله بعد'}
            {!isLast && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NarratedNight;
