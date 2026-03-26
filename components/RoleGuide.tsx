
import React, { useState } from 'react';
import { ROLE_CONFIGURATIONS, ROLE_DATA } from '../constants';
// Added Team to the imports from ../types to fix "Cannot find name 'Team'" errors
import { Role, Team } from '../types';
import { GAME_CONFIG } from '../game-config';

interface RoleGuideProps {
  onClose: () => void;
  activeRoles?: Role[];
}

const RoleGuide: React.FC<RoleGuideProps> = ({ onClose, activeRoles }) => {
  const [openConfig, setOpenConfig] = useState<string | null>(null);
  const isPlaying = activeRoles && activeRoles.length > 0;

  return (
    <div className="w-full h-full flex flex-col text-right animate-fade-in">
      <div className="flex-shrink-0 flex items-center border-b border-gray-600 mb-4 pb-2">
        <h2 className="text-xl font-bold text-yellow-400">راهنمای جامع نقش‌ها</h2>
        <button onClick={onClose} className="mr-auto text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 space-y-6 custom-scrollbar">
        
        {/* Distribution Table as Dropdowns */}
        {!isPlaying && (
          <section className="bg-gray-800/40 rounded-3xl p-4 border border-yellow-500/20 shadow-inner">
            <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>📊</span> {GAME_CONFIG.ui.distributionTable}
            </h3>
            <div className="space-y-2">
              {Object.entries(ROLE_CONFIGURATIONS).map(([count, config]) => (
                <div key={count} className="bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700">
                  <button 
                    onClick={() => setOpenConfig(openConfig === count ? null : count)}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-black text-white">{count} بازیکن</span>
                    <div className="flex items-center gap-3">
                        <span className="text-blue-400 text-xs">{config.good.length} خیر</span>
                        <span className="text-red-400 text-xs">{config.evil.length} شر</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${openConfig === count ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </button>
                  {openConfig === count && (
                    <div className="p-4 pt-0 text-right space-y-3 animate-fade-in">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-900/10 p-2 rounded-xl border border-blue-500/20">
                                <p className="text-[10px] text-blue-300 font-bold mb-1">تیم خیر:</p>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    {config.good.map((r, i) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-900/10 p-2 rounded-xl border border-red-500/20">
                                <p className="text-[10px] text-red-300 font-bold mb-1">تیم شر:</p>
                                <ul className="text-xs text-gray-300 space-y-1">
                                    {config.evil.map((r, i) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Roles Section */}
        <div className="space-y-8">
          <RoleSection title="تیم نیکان 😇" color="text-blue-400">
              {Object.values(Role)
                .filter(r => ROLE_DATA[r].team === Team.Good && (!isPlaying || activeRoles.includes(r)))
                .map(r => (
                  <RoleCard key={r} roleKey={r} isExpansion={r === Role.Lancelot} />
                ))
              }
          </RoleSection>
          
          <RoleSection title="تیم شروران 😈" color="text-red-400">
              {Object.values(Role)
                .filter(r => ROLE_DATA[r].team === Team.Evil && (!isPlaying || activeRoles.includes(r)))
                .map(r => (
                  <RoleCard key={r} roleKey={r} isExpansion={r === Role.Agravaine || r === Role.Lancelot} />
                ))
              }
          </RoleSection>
        </div>
      </div>
    </div>
  );
};

const RoleSection: React.FC<{ title: string, color: string, children: React.ReactNode }> = ({ title, color, children }) => {
    const hasContent = React.Children.count(children) > 0;
    if (!hasContent) return null;

    return (
        <div>
            <h3 className={`text-xl font-bold ${color} mb-3 pb-1 border-b-2 border-yellow-500/30`}>{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

const RoleCard: React.FC<{roleKey: Role, isExpansion?: boolean}> = ({roleKey, isExpansion}) => {
    const data = ROLE_DATA[roleKey];
    const extra = getExtraInfo(roleKey);

    return (
        <div className={`relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-5 border border-gray-600 shadow-lg hover:border-yellow-500/30 transition-all ${isExpansion ? 'border-purple-500/40 bg-purple-900/5' : ''}`}>
            {isExpansion && (
                <span className="absolute -top-2 -left-2 bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">بسته الحاقی</span>
            )}
            <div className="flex items-center gap-3 mb-3">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                {data.image ? <img src={data.image} className="w-8 h-8 object-contain" alt="" /> : <span>🎭</span>}
               </div>
               <div>
                    <h4 className="text-lg font-black text-yellow-300">{data.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{data.team === Team.Good ? GAME_CONFIG.teams.goodShort : GAME_CONFIG.teams.evilShort}</p>
               </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 bg-black/20 p-3 rounded-2xl">{data.description}</p>
            {extra && (
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-500/5 p-3 rounded-2xl border border-green-500/10">
                        <p className="text-[10px] font-black text-green-400 mb-1 uppercase tracking-tighter">راهکار استراتژیک:</p>
                        <p className="text-gray-300 text-xs leading-relaxed">{extra.strategy}</p>
                    </div>
                    <div className="bg-yellow-500/5 p-3 rounded-2xl border border-yellow-500/10">
                        <p className="text-[10px] font-black text-yellow-500 mb-1 uppercase tracking-tighter">نکته طلایی:</p>
                        <p className="text-gray-300 text-xs leading-relaxed italic">{extra.question}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function getExtraInfo(role: Role) {
    const extras: Record<string, {strategy: string, question: string}> = {
        [Role.Merlin]: { strategy: "اطلاعات را قطره‌چکانی بدهید. اگر مستقیم بگویید فلان شخص خائن است، در پایان بازی ترور می‌شوید.", question: "بهترین راهنما کسی است که تیم‌های خوب پیشنهاد می‌دهد، نه کسی که فقط خائن‌ها را می‌شناسد." },
        [Role.Percival]: { strategy: "وظیفه شما فداکاری است. اگر لازم شد، طوری بازی کنید که قاتل فکر کند شما شرلوک هستید.", question: "شرلوک واقعی معمولاً با احتیاط بیشتری صحبت می‌کند، جاسوس سعی دارد خیلی سریع اعتماد شما را جلب کند." },
        [Role.Morgana]: { strategy: "شما باید واتسون را قانع کنید که شرلوک هستید. اگر او به شما اعتماد کند، نیمی از راه پیروزی را رفته‌ای.", question: "تایید کردن یک بازیکن خوب در ابتدای بازی می‌تواند واتسون را به شک بیندازد که شما شرلوک هستید." },
        [Role.Assassin]: { strategy: "تمام مدت به حرف‌های شرلوک گوش دهید. او کیست؟ چه کسی همیشه تیم‌های درست را انتخاب می‌کند؟", question: "کسی که در لحظات حساس سکوت می‌کند اما رأی‌هایش همیشه درست است، مشکوک‌ترین فرد به شرلوک بودن است." },
        [Role.Mordred]: { strategy: "چون شرلوک شما را نمی‌بیند، بهترین فرصت را دارید تا وارد تیم‌های او شوید و در لحظه آخر شکست را بزنید.", question: "اعتماد شرلوک به بازیکنانی که نمی‌شناسد، پاشنه آشیل اوست." },
        [Role.LoyalServant]: { strategy: "شما سپر انسانی شرلوک هستید. باید با سوال پرسیدن و تحلیل رأی‌ها، مافیا را گیج کنید.", question: "اگر ۳ بار به تیم‌های مختلف رأی مخالف دادید، احتمالاً دارید به مافیا کمک می‌کنید." },
        [Role.Agravaine]: { strategy: "شما یک لنگر برای تیم شر هستید. حضور شما در یک تیم یعنی پایان موفقیت آن ماموریت.", question: "باید دلیلی منطقی برای زدن کارت شکست داشته باشید تا بلافاصله لو نروید." },
        [Role.Lancelot]: { strategy: "وفاداری شما مثل سایه در حال تغییر است. باید با جریان بازی پیش بروید.", question: "این نقش برای کسانی است که از چالش‌های ذهنی چندلایه لذت می‌برند." },
        [Role.Tristan]: { strategy: "شما و سرباز صفر ۲ یکدیگر را می‌شناسید. از این اتحاد استفاده کنید تا به شرلوک کمک کنید — دو نفر که با اطمینان کامل به هم اعتماد دارند، یک دارایی بزرگ هستند.", question: "اگر رهبر به یکی از شما و نه دیگری اعتماد کند، ممکن است جاسوسانه باشد." },
        [Role.Isolde]: { strategy: "با همکارتان هماهنگ باشید، اما مراقب باشید خیلی واضح با هم موافق نباشید — این می‌تواند شما را لو بدهد.", question: "گاهی بهتر است ظاهراً مخالف هم رأی بدهید تا دشمن متوجه اتحادتان نشود." },
        [Role.Oberon]: { strategy: "شما هیچ اطلاعاتی از تیم مافیا ندارید. روی تحلیل رفتار بازیکنان تمرکز کنید و سعی کنید در مأموریت‌ها جا باز کنید.", question: "شما باید مثل یک مافیای مستقل بازی کنید — بدون نقشه مشترک با بقیه." }
    };
    return extras[role] || null;
}

export default RoleGuide;
