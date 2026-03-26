import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  buttonText?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, buttonText = "ادامه" }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900/95 border border-yellow-500/30 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.1)] p-6 flex flex-col animate-fade-in max-h-[85vh] overflow-hidden">
        <h2 className="text-2xl font-lalezar text-yellow-400 text-center mb-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">{title}</h2>
        <div className="flex-grow mb-6 text-gray-200 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-lalezar text-xl py-4 px-4 rounded-[1.5rem] shadow-[0_8px_25px_rgba(202,138,4,0.35)] transform active:scale-[0.97] transition-all duration-200 border-t border-white/20"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
