import React, { useState } from 'react';

interface RulesAndFaqProps {
  onClose: () => void;
}

const RulesAndFaq: React.FC<RulesAndFaqProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'faq'>('rules');

  return (
    <div className="w-full h-full flex flex-col text-right">
      <div className="flex-shrink-0 flex items-center border-b border-gray-700/60 mb-4">
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-2 px-4 text-lg font-bold transition-colors ${activeTab === 'rules' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          قوانین
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`py-2 px-4 text-lg font-bold transition-colors ${activeTab === 'faq' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          سوالات متداول
        </button>
        <button onClick={onClose} className="mr-auto text-gray-400 hover:text-white pr-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'rules' ? <RulesContent /> : <FaqContent />}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-yellow-300 mb-3 pb-1 border-b border-yellow-500/20 flex items-center gap-2">{title}</h3>
        <div className="space-y-2.5 text-gray-300 text-sm leading-relaxed">{children}</div>
    </div>
);

const RulesContent: React.FC = () => (
    <>
        <Section title="🎯 هدف بازی">
            <p>بازی در دو تیم <span className="text-blue-400 font-bold">شهروندان</span> و <span className="text-red-400 font-bold">مافیا</span> انجام می‌شود.</p>
            <p>تیم شهروندان با <strong>موفقیت در ۳ مأموریت</strong> برنده می‌شود — اما اگر قاتل حرفه‌ای بتواند <strong>شرلوک</strong> را شناسایی و ترور کند، مافیا پیروز خواهد شد.</p>
            <p>تیم مافیا با <strong>ناموفق کردن ۳ مأموریت</strong> یا با ترور موفقیت‌آمیز شرلوک برنده می‌شود.</p>
        </Section>
        <Section title="🌙 فاز شب (در ابتدای بازی)">
            <p>۱. همه چشم‌ها را می‌بندند.</p>
            <p>۲. اعضای مافیا (به جز شهروند خبیث) یکدیگر را می‌شناسند.</p>
            <p>۳. مافیا شست‌های خود را بالا می‌آورند تا <strong>شرلوک</strong> آن‌ها را ببیند (پدرخوانده استثناست).</p>
            <p>۴. <strong>واتسون</strong> بیدار می‌شود و دو نفر را می‌بیند — یکی شرلوک، دیگری جاسوس مافیا.</p>
        </Section>
        <Section title="📋 فازهای اصلی بازی">
            <p>۱. <strong>پیشنهاد تیم:</strong> رهبر فعلی، تیمی را برای انجام مأموریت انتخاب می‌کند.</p>
            <p>۲. <strong>رأی‌گیری:</strong> همه بازیکنان به تیم پیشنهادی رأی «موافق» یا «مخالف» می‌دهند.</p>
            <p>۳. <strong>اجرای مأموریت:</strong> اگر تیم رأی بیاورد، اعضا کارت «پیروزی» یا «شکست» بازی می‌کنند.</p>
            <p>۴. <strong>ترور نهایی:</strong> اگر شهروندان ۳ مأموریت ببرند، قاتل حرفه‌ای یک شانس دارد شرلوک را بکشد.</p>
        </Section>
        <Section title="⚠️ قوانین مهم">
            <p><strong>رأی‌گیری تیم:</strong> اگر اکثریت موافق باشند، تیم به مأموریت می‌رود. در غیر این صورت، رهبری به نفر بعدی منتقل می‌شود و شمارنده رد تیمی بالا می‌رود. اگر ۵ بار متوالی هیچ تیمی تأیید نشود، <span className="text-red-400 font-bold">مافیا برنده می‌شود</span>.</p>
            <p><strong>مأموریت:</strong> شهروندان <em>همیشه</em> باید کارت «پیروزی» بازی کنند. مافیا می‌تواند «پیروزی» یا «شکست» بازی کند. در اکثر مأموریت‌ها، یک کارت شکست کافیست (در بازی ۷ نفره به بالا، مأموریت چهارم به ۲ کارت شکست نیاز دارد).</p>
        </Section>
    </>
);

const FaqContent: React.FC = () => (
    <>
        <Section title="آیا می‌توانم دروغ بگویم؟">
            <p>بله! دروغ گفتن، بلوف زدن و فریب دادن بخش اصلی بازی است. هر کسی می‌تواند ادعا کند هر نقشی را دارد.</p>
        </Section>
        <Section title="مافیا چه کسانی را می‌شناسند؟">
            <p>اعضای مافیا در فاز شب یکدیگر را می‌بینند — <strong>به جز شهروند خبیث</strong> که نه کسی را می‌شناسد و نه کسی او را می‌شناسد. او به تنهایی بازی می‌کند.</p>
        </Section>
        <Section title="شرلوک چه کسانی را می‌شناسد؟">
            <p>شرلوک تمام اعضای مافیا را می‌شناسد — <strong>به جز پدرخوانده</strong> که از دید شرلوک مخفی است.</p>
        </Section>
        <Section title="واتسون چه می‌بیند؟">
            <p>واتسون دو نفر را می‌بیند: یکی <strong>شرلوک</strong> و دیگری <strong>جاسوس مافیا</strong> — اما نمی‌داند کدام‌یک کدام است. جاسوس برای فریب واتسون آمده!</p>
        </Section>
        <Section title="اگر در تیم مأموریت نباشم چه می‌کنم؟">
            <p>فقط اعضای تیم تأیید شده می‌توانند کارت بازی کنند. بقیه فقط نظاره‌گر هستند.</p>
        </Section>
        <Section title="چطور شرلوک کشته می‌شود؟">
            <p>اگر شهروندان ۳ مأموریت برنده شوند، قاتل حرفه‌ای یک فرصت دارد شرلوک را از بین بقیه شهروندان پیدا کند. اگر درست حدس بزند، <span className="text-red-400 font-bold">مافیا برنده می‌شود</span>.</p>
        </Section>
    </>
);

export default RulesAndFaq;
