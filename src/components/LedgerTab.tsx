import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, BookOpen } from 'lucide-react';
import { supabase, isSupabaseConfigured, LedgerEntry } from '@/supabase';

export default function LedgerTab() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [note, setNote] = useState('');

  const fetchEntries = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('ledger_entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Could not load entries.');
    } else {
      setEntries((data as LedgerEntry[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async () => {
    const amt = parseFloat(amount);
    if (!name.trim() || !amt || amt <= 0 || !supabase) return;
    const { data, error } = await supabase
      .from('ledger_entries')
      .insert({
        customer_name: name.trim(),
        amount: amt,
        type,
        note: note.trim() || null,
      })
      .select()
      .single();
    if (error) {
      setError('Could not save entry.');
      return;
    }
    setEntries(prev => [data as LedgerEntry, ...prev]);
    setName('');
    setAmount('');
    setNote('');
    setType('credit');
    setShowForm(false);
  };

  const deleteEntry = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('ledger_entries').delete().eq('id', id);
    if (error) {
      setError('Could not delete entry.');
      return;
    }
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const totalCredit = entries.filter(e => e.type === 'credit').reduce((s, e) => s + Number(e.amount), 0);
  const totalDebit = entries.filter(e => e.type === 'debit').reduce((s, e) => s + Number(e.amount), 0);
  const balance = totalCredit - totalDebit;

  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div className="px-4 flex flex-col gap-3">
      {/* Balance summary */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wide">Net Balance</span>
          <span className={`font-bold text-2xl ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ₹{fmt(balance)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
            <div className="flex items-center gap-1.5">
              <ArrowDownCircle size={14} className="text-emerald-400" />
              <span className="text-white/50 text-xs">Jama (Credit)</span>
            </div>
            <div className="text-emerald-400 font-bold text-lg mt-1">₹{fmt(totalCredit)}</div>
          </div>
          <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
            <div className="flex items-center gap-1.5">
              <ArrowUpCircle size={14} className="text-red-400" />
              <span className="text-white/50 text-xs">Udhaar (Debit)</span>
            </div>
            <div className="text-red-400 font-bold text-lg mt-1">₹{fmt(totalDebit)}</div>
          </div>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowForm(s => !s)}
        className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-emerald-400 font-semibold active:scale-95 transition-transform"
      >
        <Plus size={18} />
        {showForm ? 'Close' : 'Add Entry'}
      </button>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Customer name"
            className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50 placeholder-white/30"
          />
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount ₹"
            className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50 placeholder-white/30"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType('credit')}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95
                ${type === 'credit' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/50 border border-white/10'}`}
            >
              Jama (Credit)
            </button>
            <button
              onClick={() => setType('debit')}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95
                ${type === 'debit' ? 'bg-red-500 text-black' : 'bg-white/5 text-white/50 border border-white/10'}`}
            >
              Udhaar (Debit)
            </button>
          </div>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-white text-sm outline-none border border-white/10 focus:border-emerald-500/50 placeholder-white/30"
          />
          <button
            onClick={addEntry}
            disabled={!name.trim() || !amount}
            className="bg-emerald-500 text-black rounded-xl py-3 font-bold active:scale-95 transition-transform disabled:opacity-40 disabled:active:scale-100"
          >
            Save Entry
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass rounded-2xl p-3 text-red-400 text-sm text-center">{error}</div>
      )}

      {/* Not configured warning */}
      {!isSupabaseConfigured && (
        <div className="glass rounded-2xl p-4 text-amber-400/80 text-sm text-center">
          Database not configured. Set up Supabase credentials to use the ledger.
        </div>
      )}

      {/* Entries list */}
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="glass rounded-2xl p-6 text-white/40 text-sm text-center">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-2">
            <BookOpen size={32} className="text-white/20" />
            <p className="text-white/40 text-sm text-center">No entries yet. Add your first transaction!</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${entry.type === 'credit' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                {entry.type === 'credit' ? (
                  <ArrowDownCircle size={20} className="text-emerald-400" />
                ) : (
                  <ArrowUpCircle size={20} className="text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{entry.customer_name}</div>
                {entry.note && <div className="text-white/40 text-xs truncate">{entry.note}</div>}
                <div className="text-white/30 text-xs">
                  {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-bold text-sm ${entry.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {entry.type === 'credit' ? '+' : '−'}₹{fmt(Number(entry.amount))}
                </div>
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-white/20 hover:text-red-400 active:scale-90 transition-all p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
