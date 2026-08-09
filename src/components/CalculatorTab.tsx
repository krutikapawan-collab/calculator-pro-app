import { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';

const MAX_LEN = 12;

export default function CalculatorTab() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  useEffect(() => {
    if (!expr) {
      setResult('0');
      return;
    }
    try {
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      if (!/^[0-9+\-*/.%() ]*$/.test(sanitized)) {
        setResult('Error');
        return;
      }
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${sanitized})`)();
      if (val === Infinity || val === -Infinity || Number.isNaN(val)) {
        setResult('Error');
      } else {
        setResult(String(Number(val.toFixed(10))));
      }
    } catch {
      setResult('Error');
    }
  }, [expr]);

  const press = (key: string) => {
    if (justEvaluated && /[0-9.]/.test(key)) {
      setExpr(key);
      setJustEvaluated(false);
      return;
    }
    if (justEvaluated && /[+\-×÷%]/.test(key)) {
      setExpr(result);
      setJustEvaluated(false);
    }
    setExpr(prev => (prev.length < MAX_LEN ? prev + key : prev));
  };

  const clearAll = () => {
    setExpr('');
    setResult('0');
    setJustEvaluated(false);
  };

  const backspace = () => {
    setExpr(prev => prev.slice(0, -1));
    setJustEvaluated(false);
  };

  const equals = () => {
    if (result !== 'Error' && result !== '0') {
      setExpr(result);
      setJustEvaluated(true);
    }
  };

  const toggleSign = () => {
    setExpr(prev => {
      if (!prev) return prev;
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      return `-(${prev})`;
    });
  };

  const buttons: { label: string; onClick: () => void; variant?: 'op' | 'fn' | 'eq' | 'wide' }[] = [
    { label: 'AC', onClick: clearAll, variant: 'fn' },
    { label: '( )', onClick: () => press('('), variant: 'fn' },
    { label: '%', onClick: () => press('%'), variant: 'fn' },
    { label: '÷', onClick: () => press('÷'), variant: 'op' },
    { label: '7', onClick: () => press('7') },
    { label: '8', onClick: () => press('8') },
    { label: '9', onClick: () => press('9') },
    { label: '×', onClick: () => press('×'), variant: 'op' },
    { label: '4', onClick: () => press('4') },
    { label: '5', onClick: () => press('5') },
    { label: '6', onClick: () => press('6') },
    { label: '−', onClick: () => press('-'), variant: 'op' },
    { label: '1', onClick: () => press('1') },
    { label: '2', onClick: () => press('2') },
    { label: '3', onClick: () => press('3') },
    { label: '+', onClick: () => press('+'), variant: 'op' },
    { label: '0', onClick: () => press('0'), variant: 'wide' },
    { label: '.', onClick: () => press('.') },
    { label: '=', onClick: equals, variant: 'eq' },
  ];

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Display */}
      <div className="glass rounded-3xl p-5 min-h-[120px] flex flex-col justify-end">
        <div className="text-white/30 text-sm text-right break-all min-h-[20px]">
          {expr || '\u00A0'}
        </div>
        <div className={`text-right font-bold mt-1 break-all ${result.length > 8 ? 'text-3xl' : 'text-5xl'} text-emerald-400`}>
          {result}
        </div>
      </div>

      {/* Toggle sign + backspace row */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={toggleSign}
          className="glass rounded-2xl py-3 text-white/70 font-semibold text-sm active:scale-95 transition-transform"
        >
          ±
        </button>
        <button
          onClick={backspace}
          className="glass rounded-2xl py-3 text-white/70 font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Delete size={18} />
          <span className="text-sm">Del</span>
        </button>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => {
          const base = 'rounded-2xl py-4 text-xl font-semibold active:scale-95 transition-transform flex items-center justify-center';
          const wide = btn.variant === 'wide' ? 'col-span-2' : '';
          let style = 'glass text-white';
          if (btn.variant === 'op') style = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
          if (btn.variant === 'fn') style = 'bg-white/5 text-white/60 border border-white/10';
          if (btn.variant === 'eq') style = 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30';
          return (
            <button
              key={i}
              onClick={btn.onClick}
              className={`${base} ${wide} ${style}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
