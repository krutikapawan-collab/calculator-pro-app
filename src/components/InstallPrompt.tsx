import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

type BIP = {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIP | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as unknown as BIP);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
      setDeferred(null);
      setVisible(false);
    }
  };

  const dismiss = () => {
    setVisible(false);
    setDeferred(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
      <div className="glass rounded-2xl p-4 flex items-center gap-3 shadow-2xl border-emerald-500/20">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
          <Download size={20} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">Install Calculator 1+</div>
          <div className="text-white/40 text-xs">Add to home screen for quick access</div>
        </div>
        <button
          onClick={install}
          className="bg-emerald-500 text-black rounded-xl px-4 py-2 text-sm font-bold active:scale-95 transition-transform flex-shrink-0"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          className="text-white/30 hover:text-white/60 active:scale-90 transition-all flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
