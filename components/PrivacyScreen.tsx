
import React, { useState, useEffect } from 'react';

interface PrivacyScreenProps {
  message: string;
  buttonText: string;
  onContinue: () => void;
  cooldown?: number; // in seconds
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
  
  const handleHide = () => {
    setIsLocked(true);
    setIsRevealed(false);
    setTimer(cooldown);
    onContinue();
  };

  if (!isRevealed) {
    return (
      <div onClick={handleReveal} className="w-full h-full flex flex-col items-center justify-center text-center p-4 cursor-pointer bg-black/50 backdrop-blur-sm rounded-xl select-none tap-highlight-transparent">
        <p className="text-2xl font-bold mb-4">{message}</p>
        <div className="w-24 h-24 my-6 flex items-center justify-center rounded-full bg-gray-700/50 border-2 border-yellow-400/50">
           {isLocked ? (
                <span className="text-4xl font-mono text-yellow-400">{timer}</span>
           ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
           )}
        </div>
        <p className="text-xl">{isLocked ? "در حال آماده سازی..." : buttonText}</p>
      </div>
    );
  }

  return (
    <div onClick={handleHide} className="w-full h-full flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none tap-highlight-transparent">
      {children}
    </div>
  );
};

export default PrivacyScreen;