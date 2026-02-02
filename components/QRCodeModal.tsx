
import React from 'react';
import Modal from './Modal';

interface QRCodeModalProps {
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose }) => {
  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&bgcolor=111827&color=FACC15`;

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('لینک بازی کپی شد!');
  };

  return (
    <Modal title="اشتراک‌گذاری بازی" onClose={onClose} buttonText="بستن">
      <div className="flex flex-col items-center text-center space-y-4">
        <p className="text-gray-300 text-sm">بقیه بازیکنان می‌توانند با اسکن این کد وارد بازی شوند:</p>
        
        <div className="p-4 bg-gray-900 rounded-2xl border-4 border-yellow-500/30 shadow-2xl animate-fade-in">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className="w-48 h-48 rounded-lg"
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
            style={{ opacity: 0, transition: 'opacity 0.5s' }}
          />
        </div>

        <button 
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-yellow-400 transition-colors border border-yellow-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          کپی لینک بازی
        </button>

        <p className="text-xs text-gray-500 italic">نکته: همه بازیکنان باید از یک لینک استفاده کنند.</p>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
