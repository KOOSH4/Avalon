
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
      <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar px-1 space-y-6">
        <div className="flex flex-col items-center mt-2">
            <h2 className="text-3xl font-lalezar text-yellow-400 mb-1">{GAME_CONFIG.ui.setupTitle}</h2>
            <p className="text-gray-400 text-xs font-bold">برای شروع، قهرمانان خود را معرفی کنید</p>
        </div>
        
        <div className="space-y-4">
            <div className="text-right">
                <label htmlFor="player-count" className="block mb-2 text-xs text-gray-400 pr-2 font-black">تعداد مبارزان</label>
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
            </div>

            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
                    <span className="text-sm font-black text-gray-200">تأیید گروهی شب 🌙</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={useNarratedNight} onChange={() => setUseNarratedNight(!useNarratedNight)} className="sr-only peer" />
                        <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-900/10 rounded-[1.5rem] border border-purple-500/20 backdrop-blur-md">
                    <span className="text-sm font-black text-purple-300">{GAME_CONFIG.ui.expansionLabel} ⚔️</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={useExpansion} onChange={() => setUseExpansion(!useExpansion)} className="sr-only peer" />
                        <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
            </div>

            <div className="space-y-2.5">
                <label className="block text-xs text-gray-400 pr-2 font-black text-right">اسامی مبارزان</label>
                <div className="grid grid-cols-1 gap-2">
                    {playerNames.map((name, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={GAME_CONFIG.defaultPlayerNames[index] || `مبارز ${index + 1}`}
                            value={name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full p-4 bg-gray-800/20 border border-gray-700/30 rounded-[1.2rem] text-white text-center placeholder-gray-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:bg-gray-800/40 transition-all font-bold text-sm"
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
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-lalezar text-2xl py-5 px-4 rounded-[1.8rem] shadow-[0_12px_40px_rgba(202,138,4,0.3)] transform active:scale-[0.97] transition-all duration-300 border-t border-white/20"
        >
            {GAME_CONFIG.ui.startButton}
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
