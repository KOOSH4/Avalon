
import React from 'react';
import { Role, Team, RoleInfo, Player } from './types';
import { GAME_CONFIG } from './game-config';

const EvilTeammates: React.FC<{players: Player[], self: Player}> = ({ players, self }) => {
  const isOberonInGame = players.some(p => p.role === Role.Oberon);
  const evilPlayers = players.filter(p => p.team === Team.Evil && p.id !== self.id && p.role !== Role.Oberon);
  const oberonText = isOberonInGame ? ' (به جز شهروند خبیث 😶)' : '';

  if (evilPlayers.length === 0) {
    if (self.role === Role.Oberon) return <>شما هیچ‌کس را نمی‌شناسید.</>;
    return <>شما تنها مافیا هستید{oberonText}.</>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-200">هم‌تیمی‌های مافیای شما{oberonText}:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {evilPlayers.map((p) => (
          <span key={p.id} className="px-3 py-1 bg-red-900/40 border border-red-500/30 rounded-full text-red-200 font-bold">
            {p.name} 🕴️
          </span>
        ))}
      </div>
    </div>
  );
}

export const ROLE_DATA: { [key in Role]: RoleInfo } = {
  [Role.Merlin]: {
    name: Role.Merlin,
    team: Team.Good,
    description: GAME_CONFIG.roles.merlin.detail,
    knowledge: (players) => {
      const isMordredInGame = players.some(p => p.role === Role.Mordred);
      const evilPlayers = players.filter(p => p.team === Team.Evil && p.role !== Role.Mordred);
      const mordredText = isMordredInGame ? ' (به جز پدرخوانده 🎭)' : '';
      
      return (
        <div className="text-center">
          <p className="mb-2 text-sm">چهره واقعی مافیا شناسایی شده{mordredText}:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {evilPlayers.map(p => (
              <span key={p.id} className="px-3 py-1 bg-red-900/40 border border-red-500/30 rounded-full text-red-200 font-bold">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      );
    },
    image: 'https://img.icons8.com/fluency/96/sherlock-holmes.png',
  },
  [Role.Percival]: {
    name: Role.Percival,
    team: Team.Good,
    description: GAME_CONFIG.roles.percival.detail,
    knowledge: (players) => {
      const targets = players
        .filter(p => p.role === Role.Merlin || p.role === Role.Morgana)
        .map(p => p.name)
        .sort(() => Math.random() - 0.5);
       if (targets.length < 2) return 'شرلوک یا جاسوس در بازی نیستند.';
      return (
        <div className="text-center">
          <p className="mb-2 text-sm">یکی شرلوک 🕵️‍♂️ و دیگری جاسوس 🕵️‍♀️ است:</p>
          <div className="flex gap-4 justify-center">
             <span className="px-4 py-2 bg-yellow-900/40 border border-yellow-500/30 rounded-xl text-yellow-200 font-bold">{targets[0]}</span>
             <span className="px-4 py-2 bg-yellow-900/40 border border-yellow-500/30 rounded-xl text-yellow-200 font-bold">{targets[1]}</span>
          </div>
        </div>
      );
    },
    image: 'https://img.icons8.com/fluency/96/policeman-male.png',
  },
  [Role.LoyalServant]: {
    name: Role.LoyalServant,
    team: Team.Good,
    description: GAME_CONFIG.roles.servant.detail,
    knowledge: () => <p className="text-blue-200 italic">"حقیقت همیشه پیروز است."</p>,
    image: 'https://img.icons8.com/fluency/96/person-male.png',
  },
  [Role.Tristan]: {
    name: Role.Tristan,
    team: Team.Good,
    description: GAME_CONFIG.roles.tristan.detail,
    knowledge: (players) => {
        const isolde = players.find(p => p.role === Role.Isolde);
        return isolde ? <p>همکار شما <span className="text-blue-300 font-bold">{isolde.name}</span> است. 👮‍♂️</p> : 'سرباز صفر (۲) در بازی نیست.';
    },
    image: 'https://img.icons8.com/fluency/96/police-badge.png',
  },
  [Role.Isolde]: {
    name: Role.Isolde,
    team: Team.Good,
    description: GAME_CONFIG.roles.isolde.detail,
    knowledge: (players) => {
        const tristan = players.find(p => p.role === Role.Tristan);
        return tristan ? <p>همکار شما <span className="text-blue-300 font-bold">{tristan.name}</span> است. 👮‍♂️</p> : 'سرباز صفر (۱) در بازی نیست.';
    },
    image: 'https://img.icons8.com/fluency/96/police-badge.png',
  },
  [Role.Morgana]: {
    name: Role.Morgana,
    team: Team.Evil,
    description: GAME_CONFIG.roles.morgana.detail,
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: 'https://img.icons8.com/fluency/96/spy-female.png',
  },
  [Role.Assassin]: {
    name: Role.Assassin,
    team: Team.Evil,
    description: GAME_CONFIG.roles.assassin.detail,
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: 'https://img.icons8.com/fluency/96/gun.png',
  },
  [Role.Mordred]: {
    name: Role.Mordred,
    team: Team.Evil,
    description: GAME_CONFIG.roles.mordred.detail,
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: 'https://img.icons8.com/fluency/96/mafia-boss.png',
  },
  [Role.Oberon]: {
    name: Role.Oberon,
    team: Team.Evil,
    description: GAME_CONFIG.roles.oberon.detail,
    knowledge: () => <p className="text-red-300 italic">"در سایه‌ها، هیچ دوستی وجود ندارد."</p>,
    image: 'https://img.icons8.com/fluency/96/suspect.png',
  },
  [Role.Agravaine]: {
    name: Role.Agravaine,
    team: Team.Evil,
    description: GAME_CONFIG.roles.agravaine.detail,
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: 'https://img.icons8.com/fluency/96/burglar.png',
  },
  [Role.Lancelot]: {
    name: Role.Lancelot,
    team: Team.Evil,
    description: GAME_CONFIG.roles.lancelot.detail,
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: 'https://img.icons8.com/fluency/96/corrupt-cop.png',
  },
};

export const ROLE_CONFIGURATIONS: { [key: number]: { good: Role[], evil: Role[] } } = {
  5: { good: [Role.Merlin, Role.Percival, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin] },
  6: { good: [Role.Merlin, Role.Percival, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin] },
  7: { good: [Role.Merlin, Role.Percival, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred] },
  8: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Oberon] },
  9: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred] },
  10: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred, Role.Oberon] },
};

// Function to inject expansion roles if requested
export const getExpandedConfig = (count: number, expansion: boolean) => {
  const base = ROLE_CONFIGURATIONS[count];
  if (!expansion) return base;

  const newGood = [...base.good];
  const newEvil = [...base.evil];

  if (count >= 7) {
    // Replace one servant with something else or just add the expansion role logic
    // For simplicity, we swap standard evil with expansions
    if (newEvil.includes(Role.Mordred)) {
       newEvil[newEvil.indexOf(Role.Mordred)] = Role.Agravaine;
    }
  }

  return { good: newGood, evil: newEvil };
};

export const QUEST_RULES: { [key: number]: { teamSizes: number[], failsRequired: number[] } } = {
  5: { teamSizes: [2, 3, 2, 3, 3], failsRequired: [1, 1, 1, 1, 1] },
  6: { teamSizes: [2, 3, 4, 3, 4], failsRequired: [1, 1, 1, 1, 1] },
  7: { teamSizes: [2, 3, 3, 4, 4], failsRequired: [1, 1, 1, 2, 1] },
  8: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
  9: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
  10: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
};

export const STRINGS_FA = {
  passTo: "گوشی را به {player} بدهید",
  tapToReveal: "مشاهده نقش مخفی",
  passToNext: "گوشی را به نفر بعدی بدهید",
  cooldown: "آماده سازی...",
  approve: "موافق 👍",
  reject: "مخالف 👎",
  success: "پیروزی ✨",
  fail: "شکست 💥",
};

export const GameIcon = (
    <div className="text-3xl animate-bounce">🕵️‍♂️</div>
);

export const CrownIcon = (
    <span className="text-2xl drop-shadow-md">🎖️</span>
);

export const ROLE_TAGLINES: Partial<Record<Role, string>> = {
  [Role.Merlin]: GAME_CONFIG.roles.merlin.tagline,
  [Role.Percival]: GAME_CONFIG.roles.percival.tagline,
  [Role.LoyalServant]: GAME_CONFIG.roles.servant.tagline,
  [Role.Tristan]: GAME_CONFIG.roles.tristan.tagline,
  [Role.Isolde]: GAME_CONFIG.roles.isolde.tagline,
  [Role.Morgana]: GAME_CONFIG.roles.morgana.tagline,
  [Role.Assassin]: GAME_CONFIG.roles.assassin.tagline,
  [Role.Mordred]: GAME_CONFIG.roles.mordred.tagline,
  [Role.Oberon]: GAME_CONFIG.roles.oberon.tagline,
  [Role.Agravaine]: GAME_CONFIG.roles.agravaine.tagline,
  [Role.Lancelot]: GAME_CONFIG.roles.lancelot.tagline,
};
