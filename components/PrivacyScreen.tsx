
import React, { useState, useEffect } from 'react';

interface PrivacyScreenProps {
  message: string;
  buttonText: string;
  onContinue: () => void;
  cooldown?: number;
  children?: React.ReactNode;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  message,
  buttonText,
  onContinue,
  cooldown = 3,
  children,
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [timer, setTimer] = useState(cooldown);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsLocked(true);
    setTimer(cooldown);
    setIsRevealed(false);
  }, [cooldown]);

  useEffect(() => {
    if (isLocked) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked]);

  const handleReveal = () => {
    if (isLocked) return;
    setIsRevealed(true);
  };

  // exposed for children via onContinue
  const handleHide = () => {
    setIsLocked(true);
    setIsRevealed(false);
    setTimer(cooldown);
    onContinue();
  };

  if (!isRevealed) {
    return (
      <div
        onClick={handleReveal}
        className="w-full h-full flex flex-col items-center justify-center text-center p-6 cursor-pointer select-none tap-highlight-transparent bg-black/60 backdrop-blur-md rounded-3xl border border-white/5"
      >
        <p className="text-xl font-bold text-gray-100 mb-8 leading-relaxed">{message}</p>
        <div className={`w-24 h-24 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${isLocked ? 'border-yellow-500/30 bg-gray-900/80' : 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_20px_rgba(234,179,8,0.3)]'}`}>
          {isLocked ? (
            <span className="text-4xl font-mono font-black text-yellow-400">{timer}</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </div>
        <p className={`mt-6 text-base font-bold transition-colors duration-300 ${isLocked ? 'text-gray-500' : 'text-yellow-300'}`}>
          {isLocked ? 'لطفاً صبر کنید...' : buttonText}
        </p>
      </div>
    );
  }

  // Revealed: just show children — no tap-anywhere dismiss
  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      {typeof children === 'function' ? (children as (hide: () => void) => React.ReactNode)(handleHide) : children}
    </div>
  );
};

export default PrivacyScreen;
