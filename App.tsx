import { useState } from 'react';
import { Calculator, Percent, CreditCard, BookOpen, Globe } from 'lucide-react';
import CalculatorTab from '@/components/CalculatorTab';
import GstTab from '@/components/GstTab';
import EmiTab from '@/components/EmiTab';
import CurrencyTab from '@/components/CurrencyTab';
import LedgerTab from '@/components/LedgerTab';
import InstallPrompt from '@/components/InstallPrompt';

type Tab = 'calc' | 'gst' | 'emi' | 'currency' | 'ledger';

const TABS: { id: Tab; label: string; icon: React.ElementType; short: string }[] = [
  { id: 'calc',     label: 'Calculator',  icon: Calculator, short: 'Calc'    },
  { id: 'gst',      label: 'GST / Tax',   icon: Percent,    short: 'GST'     },
  { id: 'emi',      label: 'Loan EMI',    icon: CreditCard, short: 'EMI'     },
  { id: 'currency', label: 'Currency',    icon: Globe,      short: 'Forex'   },
  { id: 'ledger',   label: 'Patthi',      icon: BookOpen,   short: 'Patthi'  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calc');

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-start">
      <div className="w-full max-w-md flex flex-col min-h-screen">

        {/* Header */}
        <div className="px-4 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Calculator size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Calculator 1+</h1>
              <p className="text-white/40 text-xs">All-in-One Money Tool</p>
            </div>
          </div>
        </div>

        {/* Tab bar — 5 tabs */}
        <div className="px-4 mb-2 flex-shrink-0">
          <div className="glass rounded-2xl p-1 grid grid-cols-5 gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onTouchStart={() => {}}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl transition-all active:scale-95
                    ${active
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                      : 'text-white/50 hover:text-white/80'}`}
                >
                  <Icon size={15} />
                  <span className="text-[9px] font-bold leading-none">{tab.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-8">
          {activeTab === 'calc'     && <CalculatorTab />}
          {activeTab === 'gst'      && <GstTab />}
          {activeTab === 'emi'      && <EmiTab />}
          {activeTab === 'currency' && <CurrencyTab />}
          {activeTab === 'ledger'   && <LedgerTab />}
        </div>

      </div>

      <InstallPrompt />
    </div>
  );
}
