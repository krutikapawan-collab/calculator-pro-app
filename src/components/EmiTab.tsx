import { useState } from 'react';

export default function EmiTab() {
  const [amount, setAmount] = useState('500000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('5');

  const P = parseFloat(amount) || 0;
  const R = (parseFloat(rate) || 0) / 12 / 100;
  const N = (parseFloat(tenure) || 0) * 12;

  let emi = 0;
  let totalPayable = 0;
  let totalInterest = 0;

  if (P > 0 && R > 0 && N > 0) {
    emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    totalPayable = emi * N;
    totalInterest = totalPayable - P;
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const principalPct = totalPayable > 0 ? (P / totalPayable) * 100 : 0;
  const interestPct = totalPayable > 0 ? 100 - principalPct : 0;

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Loan amount */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <label className="text-white/40 text-xs font-medium">Loan Amount</label>
          <span className="text-emerald-400 font-bold text-lg">₹{fmt(P)}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="10000000"
          step="10000"
          value={Math.min(Math.max(P, 10000), 10000000)}
          onChange={e => setAmount(e.target.value)}
          className="w-full mt-3"
        />
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-3 py-2 mt-2 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50"
        />
      </div>

      {/* Interest rate */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <label className="text-white/40 text-xs font-medium">Interest Rate (% p.a.)</label>
          <span className="text-emerald-400 font-bold text-lg">{parseFloat(rate) || 0}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="0.1"
          value={Math.min(Math.max(parseFloat(rate) || 1, 1), 30)}
          onChange={e => setRate(e.target.value)}
          className="w-full mt-3"
        />
        <input
          type="number"
          value={rate}
          onChange={e => setRate(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-3 py-2 mt-2 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50"
        />
      </div>

      {/* Tenure */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <label className="text-white/40 text-xs font-medium">Tenure (years)</label>
          <span className="text-emerald-400 font-bold text-lg">{parseFloat(tenure) || 0} yr</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={Math.min(Math.max(parseFloat(tenure) || 1, 1), 30)}
          onChange={e => setTenure(e.target.value)}
          className="w-full mt-3"
        />
        <input
          type="number"
          value={tenure}
          onChange={e => setTenure(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-3 py-2 mt-2 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50"
        />
      </div>

      {/* EMI Result */}
      <div className="glass rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20">
        <label className="text-white/40 text-xs font-medium">Monthly EMI</label>
        <div className="text-emerald-400 font-bold text-4xl mt-1">
          ₹{fmt(emi)}
        </div>
      </div>

      {/* Summary */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Principal</span>
          <span className="text-white font-semibold">₹{fmt(P)}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-sm">Total Interest</span>
          <span className="text-white font-semibold">₹{fmt(totalInterest)}</span>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-semibold">Total Payable</span>
          <span className="text-emerald-400 font-bold">₹{fmt(totalPayable)}</span>
        </div>
      </div>

      {/* Visual breakdown bar */}
      {totalPayable > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500" style={{ width: `${principalPct}%` }} />
            <div className="bg-emerald-500/40" style={{ width: `${interestPct}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-white/50 text-xs">Principal {principalPct.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
              <span className="text-white/50 text-xs">Interest {interestPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
