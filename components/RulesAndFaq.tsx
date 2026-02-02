
import React, { useState } from 'react';

interface RulesAndFaqProps {
  onClose: () => void;
}

const RulesAndFaq: React.FC<RulesAndFaqProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'faq'>('rules');

  return (
    <div className="w-full h-full flex flex-col text-right">
      <div className="flex-shrink-0 flex border-b border-gray-600 mb-4">
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-2 px-4 text-lg font-bold ${activeTab === 'rules' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          قوانین
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`py-2 px-4 text-lg font-bold ${activeTab === 'faq' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
          سوالات متداول
        </button>
        <button onClick={onClose} className="mr-auto text-gray-400 hover:text-white pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {activeTab === 'rules' ? <RulesContent /> : <FaqContent />}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-yellow-300 mb-2 pb-1 border-b-2 border-yellow-500/30">{title}</h3>
        <div className="space-y-2 text-gray-300">{children}</div>
    </div>
);


const RulesContent: React.FC = () => (
    <>
        <Section title="هدف بازی">
            <p>بازی در دو تیم نیک (آبی) و شر (قرمز) انجام می‌شود. تیم نیک با موفقیت در ۳ ماموریت برنده می‌شود. تیم شر با ناموفق کردن ۳ ماموریت، یا با ترور موفقیت‌آمیز مرلین، برنده می‌شود.</p>
        </Section>
        <Section title="فازهای بازی">
            <p>۱. <strong>تعیین نقش:</strong> به هر بازیکن یک نقش مخفی داده می‌شود.</p>
            <p>۲. <strong>فاز شب:</strong> بازیکنان چشم‌ها را می‌بندند. برخی نقش‌ها اطلاعاتی کسب می‌کنند.</p>
            <p>۳. <strong>پیشنهاد تیم:</strong> رهبر فعلی، تیمی را برای انجام ماموریت پیشنهاد می‌دهد.</p>
            <p>۴. <strong>رأی‌گیری تیم:</strong> همه بازیکنان به تیم پیشنهادی رأی "قبول" یا "رد" می‌دهند.</p>
            <p>۵. <strong>انجام ماموریت:</strong> اگر تیم رأی بیاورد، اعضای تیم کارت "موفقیت" یا "شکست" را بازی می‌کنند.</p>
        </Section>
        <Section title="قوانین مهم">
            <p><strong>رأی‌گیری:</strong> اگر اکثریت به تیم رأی "قبول" بدهند، تیم به ماموریت می‌رود. در غیر این صورت، رهبری به نفر بعدی منتقل شده و شمارنده رأی‌های ناموفق یک واحد زیاد می‌شود. اگر ۵ بار متوالی تیم رأی نیاورد، شر برنده می‌شود.</p>
            <p><strong>ماموریت:</strong> بازیکنان نیک همیشه باید کارت "موفقیت" بازی کنند. بازیکنان شر می‌توانند "موفقیت" یا "شکست" بازی کنند. در اکثر ماموریت‌ها یک کارت "شکست" کافیست تا ماموریت ناموفق شود (در بازی‌های ۷ نفره و بیشتر، ماموریت چهارم به دو کارت "شکست" نیاز دارد).</p>
            <p><strong>ترور:</strong> اگر تیم نیک ۳ ماموریت را موفق شود، آدمکش (Assassin) فرصت دارد با حدس زدن مرلین، تیم شر را برنده کند. اگر حدس اشتباه باشد، نیک برنده نهایی است.</p>
        </Section>
    </>
);

const FaqContent: React.FC = () => (
    <>
        <Section title="آیا می‌توانم در مورد نقشم دروغ بگویم؟">
            <p>بله! دروغ گفتن، بلوف زدن و فریب دادن بخش اصلی بازی است. شما می‌توانید ادعا کنید هر نقشی را دارید.</p>
        </Section>
        <Section title="آیا جاسوس‌ها (شروران) یکدیگر را می‌شناسند؟">
            <p>بله، در فاز شب، تمام اعضای تیم شر یکدیگر را می‌شناسند، به جز "اوبرون" (Oberon) که نه کسی را می‌شناسد و نه کسی او را می‌شناسد.</p>
        </Section>
        <Section title="مرلین چه کسانی را می‌شناسد؟">
            <p>مرلین تمام اعضای تیم شر را می‌شناسد، به جز "موردرد" (Mordred) که از دید او پنهان است.</p>
        </Section>
         <Section title="اگر در تیم ماموریت نباشم، می‌توانم کارت بازی کنم؟">
            <p>خیر، فقط بازیکنانی که در تیم تایید شده ماموریت هستند کارت بازی می‌کنند.</p>
        </Section>
    </>
);


export default RulesAndFaq;