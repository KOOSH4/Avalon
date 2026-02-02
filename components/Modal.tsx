
import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  buttonText?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, buttonText = "ادامه" }) => {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gray-800 border-2 border-yellow-500/50 rounded-2xl shadow-2xl p-6 flex flex-col animate-fade-in">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">{title}</h2>
        <div className="flex-grow mb-6 text-gray-200">
          {children}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;