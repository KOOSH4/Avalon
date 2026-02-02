
import React, { useState, useCallback } from 'react';
import { GAME_CONFIG } from '../game-config';

interface PlayerSetupProps {
  onSetupComplete: (playerCount: number, playerNames: string[], useNarratedNight: boolean, useExpansion: boolean) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onSetupComplete }) => {
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(5).fill(''));
  const [useNarratedNight, setUseNarratedNight] = useState<boolean>(true);
  const [useExpansion, setUseExpansion] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setPlayerCount(count);
    const existingNames = [...playerNames];
    if (count > existingNames.length) {
        const diff = count - existingNames.length;
        for (let i = 0; i < diff; i++) {
            existingNames.push('');
        }
    } else {
        existingNames.splice(count);
    }
    setPlayerNames(existingNames);
    setError('');
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = useCallback(() => {
    const finalNames = playerNames.map((name, i) => {
        const trimmed = name.trim();
        return trimmed !== '' ? trimmed : (GAME_CONFIG.defaultPlayerNames[i] || `مبارز ${i + 1}`);
    });

    const uniqueNames = new Set(finalNames);
    if (uniqueNames.size !== finalNames.length) {
      setError('نام بازیکنان باید منحصر به فرد باشد.');
      return;
    }
    
    setError('');
    onSetupComplete(playerCount, finalNames, useNarratedNight, useExpansion);
  }, [playerCount, playerNames, useNarratedNight, useExpansion, onSetupComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-1">
      <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar px-1 space-y-5">
        <div className="flex flex-col items-center mt-2">
            <h2 className="text-3xl font-lalezar text-yellow-400 mb-1">{GAME_CONFIG.ui.setupTitle}</h2>
            <p className="text-gray-400 text-xs font-bold">برای شروع، قهرمانان خود را معرفی کنید</p>
        </div>
        
        <div className="space-y-4">
            <div className="text-right">
                <label htmlFor="player-count" className="block mb-2 text-xs text-gray-400 pr-2 font-black">تعداد مبارزان</label>
                <div className="relative">
                    <select
                        id="player-count"
                        value={playerCount}
                        onChange={handlePlayerCountChange}
                        className="w-full p-4 bg-gray-800/40 border-2 border-gray-700/50 rounded-[1.5rem] text-white text-center focus:outline-none focus:border-yellow-500/50 transition-all shadow-inner font-bold text-base appearance-none"
                    >
                        {[...Array(6)].map((_, i) => (
                            <option key={i + 5} value={i + 5}>{i + 5} نفر (سناریو استاندارد)</option>
                        ))}
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {/* Night Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-[1.8rem] border border-white/5 backdrop-blur-md shadow-lg group active:bg-gray-800/50 transition-colors">
                    <label className="relative inline-flex items-center cursor-pointer tap-highlight-transparent">
                        <input type="checkbox" checked={useNarratedNight} onChange={() => setUseNarratedNight(!useNarratedNight)} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-600/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 rtl:peer-checked:after:-translate-x-7 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all after:shadow-md peer-checked:bg-amber-500 shadow-inner border border-white/10"></div>
                    </label>
                    <span className="text-sm font-black text-gray-200">تأیید گروهی شب 🌙</span>
                </div>

                {/* Expansion Toggle */}
                <div className="flex items-center justify-between p-4 bg-purple-900/10 rounded-[1.8rem] border border-purple-500/20 backdrop-blur-md shadow-lg group active:bg-purple-900/20 transition-colors">
                    <label className="relative inline-flex items-center cursor-pointer tap-highlight-transparent">
                        <input type="checkbox" checked={useExpansion} onChange={() => setUseExpansion(!useExpansion)} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-600/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 rtl:peer-checked:after:-translate-x-7 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all after:shadow-md peer-checked:bg-purple-500 shadow-inner border border-white/10"></div>
                    </label>
                    <span className="text-sm font-black text-purple-300">{GAME_CONFIG.ui.expansionLabel} ⚔️</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-xs text-gray-400 pr-2 font-black text-right">اسامی مبارزان</label>
                <div className="grid grid-cols-1 gap-2.5">
                    {playerNames.map((name, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={GAME_CONFIG.defaultPlayerNames[index] || `مبارز ${index + 1}`}
                            value={name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full p-4 bg-gray-800/20 border border-gray-700/30 rounded-[1.5rem] text-white text-center placeholder-gray-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:bg-gray-800/40 transition-all font-bold text-base shadow-sm"
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-4 pb-2">
        {error && <p className="text-red-400 mb-4 text-xs font-bold animate-pulse text-center">{error}</p>}
        <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-lalezar text-2xl py-5 px-4 rounded-[2rem] shadow-[0_12px_40px_rgba(202,138,4,0.3)] transform active:scale-[0.97] transition-all duration-300 border-t border-white/20 active:shadow-none"
        >
            {GAME_CONFIG.ui.startButton}
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
