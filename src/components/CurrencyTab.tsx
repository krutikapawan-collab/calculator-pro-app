import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, RefreshCw } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰' },
];

type Rates = Record<string, number>;

export default function CurrencyTab() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`
      );
      if (!res.ok) throw new Error('Failed to fetch rates');
      const data = await res.json();
      const fromData = data[from.toLowerCase()];
      if (!fromData) throw new Error('Currency not found');
      setRates(fromData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError('Could not load rates. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [from]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const num = parseFloat(amount) || 0;
  const rate = rates && rates[to.toLowerCase()] ? rates[to.toLowerCase()] : 0;
  const converted = num * rate;

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const currencyName = (code: string) =>
    CURRENCIES.find(c => c.code === code)?.name ?? code;
  const currencyFlag = (code: string) =>
    CURRENCIES.find(c => c.code === code)?.flag ?? '';

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Amount */}
      <div className="glass rounded-2xl p-4">
        <label className="text-white/40 text-xs font-medium">Amount</label>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-white/30 text-2xl">{currencyFlag(from)}</span>
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

      {/* From currency */}
      <div className="glass rounded-2xl p-4">
        <label className="text-white/40 text-xs font-medium">From</label>
        <select
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-3 py-2.5 mt-2 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code} className="bg-slate-800">
              {c.flag} {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-1">
        <button
          onClick={swap}
          className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowDownUp size={18} className="text-emerald-400" />
        </button>
      </div>

      {/* To currency */}
      <div className="glass rounded-2xl p-4">
        <label className="text-white/40 text-xs font-medium">To</label>
        <select
          value={to}
          onChange={e => setTo(e.target.value)}
          className="w-full bg-white/5 rounded-xl px-3 py-2.5 mt-2 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code} className="bg-slate-800">
              {c.flag} {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Result */}
      <div className="glass rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20">
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs font-medium">Converted Amount</span>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="text-white/40 text-xs flex items-center gap-1 active:scale-90 transition-transform"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="text-emerald-400 font-bold text-3xl mt-2">
          {currencyFlag(to)} {fmt(converted)}
        </div>
        <div className="text-white/40 text-xs mt-2">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : rate > 0 ? (
            <>1 {from} = {fmt(rate)} {to} {lastUpdated && `· ${lastUpdated}`}</>
          ) : (
            'Loading rates...'
          )}
        </div>
      </div>

      {/* Quick info */}
      {rate > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-white/40 text-xs font-medium uppercase tracking-wide mb-2">Rate Info</h3>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">{from} → {to}</span>
            <span className="text-white font-semibold text-sm">{fmt(rate)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/60 text-sm">{to} → {from}</span>
            <span className="text-white font-semibold text-sm">{fmt(1 / rate)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white/40 text-xs">Base</span>
            <span className="text-white/50 text-xs">{currencyName(from)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
