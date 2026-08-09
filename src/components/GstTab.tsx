import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const GST_RATES = [3, 5, 12, 18, 28];

export default function GstTab() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'add' | 'extract'>('add');

  const num = parseFloat(amount) || 0;
  const gst = mode === 'add' ? num * (rate / 100) : num - num / (1 + rate / 100);
  const total = mode === 'add' ? num + gst : num;
  const base = mode === 'add' ? num : num - gst;

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="glass rounded-2xl p-1 grid grid-cols-2 gap-1">
        <button
          onClick={() => setMode('add')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5
            ${mode === 'add' ? 'bg-emerald-500 text-black' : 'text-white/50'}`}
        >
          <TrendingUp size={15} /> Add GST
        </button>
        <button
          onClick={() => setMode('extract')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5
            ${mode === 'extract' ? 'bg-emerald-500 text-black' : 'text-white/50'}`}
        >
          <TrendingDown size={15} /> Remove GST
        </button>
      </div>

      {/* Amount input */}
      <div className="glass rounded-2xl p-4">
        <label className="text-white/40 text-xs font-medium">
          {mode === 'add' ? 'Amount (before GST)' : 'Amount (including GST)'}
        </label>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-white/30 text-2xl">₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="bg-transparent text-white text-3xl font-bold outline-none flex-1 placeholder-white/20"
          />
        </div>
      </div>

      {/* GST rate selector */}
      <div className="glass rounded-2xl p-4">
        <label className="text-white/40 text-xs font-medium">GST Rate</label>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {GST_RATES.map(r => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 flex-shrink-0
                ${rate === r ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/60 border border-white/10'}`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Base Amount</span>
          <span className="text-white font-semibold">₹{fmt(base)}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">GST ({rate}%)</span>
          <span className="text-emerald-400 font-semibold">₹{fmt(gst)}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-semibold">Total Amount</span>
          <span className="text-emerald-400 font-bold text-lg">₹{fmt(total)}</span>
        </div>
        {mode === 'extract' && (
          <div className="flex justify-between items-center">
            <span className="text-white/40 text-xs">CGST + SGST (each)</span>
            <span className="text-white/50 text-xs">₹{fmt(gst / 2)}</span>
          </div>
        )}
      </div>

      {/* Breakdown */}
      {num > 0 && (
        <div className="glass rounded-2xl p-4 flex flex-col gap-2">
          <h3 className="text-white/40 text-xs font-medium uppercase tracking-wide">Tax Breakdown</h3>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">CGST ({rate / 2}%)</span>
            <span className="text-white/80 text-sm">₹{fmt(gst / 2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">SGST ({rate / 2}%)</span>
            <span className="text-white/80 text-sm">₹{fmt(gst / 2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
