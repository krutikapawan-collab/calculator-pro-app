import { X, Shield } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PrivacyPolicy({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="glass rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-app pb-3 -mx-5 px-5 -mt-5 pt-5 rounded-t-3xl z-10">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-emerald-400" />
            <h2 className="text-white font-bold text-lg">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white active:scale-90 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <div className="text-white/70 text-sm space-y-4 leading-relaxed">
          <p className="text-white/40 text-xs">Last updated: August 11, 2026</p>

          <section>
            <h3 className="text-white font-semibold mb-1">1. Overview</h3>
            <p>
              Calculator 1+ (&ldquo;the App&rdquo;) is an all-in-one money tool that includes a
              calculator, GST/tax calculator, loan EMI calculator, currency converter, and a
              ledger book (Patthi). We are committed to protecting your privacy.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">2. Data We Collect</h3>
            <p className="mb-2"><strong className="text-white">Local &amp; cloud-synced data:</strong> Ledger entries (customer name, amount, type, note) you create are stored securely in our cloud database so you can access them across sessions.</p>
            <p className="mb-2"><strong className="text-white">Currency rates:</strong> The app fetches live exchange rates from a public API. No personal data is sent in these requests.</p>
            <p><strong className="text-white">No personal data collection:</strong> We do not collect personal identifiers, device IDs, location, contacts, or photos. No account or login is required.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">3. How Data Is Used</h3>
            <p>Your ledger entries are used solely to display and manage your own transactions within the App. They are never sold, shared, or used for advertising.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">4. Data Storage &amp; Security</h3>
            <p>Ledger data is stored in a Supabase-hosted PostgreSQL database protected by row-level security policies. Only data you enter is stored; all communication is encrypted via HTTPS.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">5. Third-Party Services</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">Supabase</strong> — cloud database for ledger storage</li>
              <li><strong className="text-white">jsDelivr / fawazahmed0 currency-api</strong> — public exchange-rate data</li>
            </ul>
            <p className="mt-2">These services operate under their own privacy policies. We send only the minimum needed (e.g., a currency code) and never your personal data.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">6. Children&rsquo;s Privacy</h3>
            <p>The App is suitable for general audiences. We do not knowingly collect any data from children.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">7. Your Rights</h3>
            <p>You can delete any ledger entry at any time from within the App. Deleting an entry permanently removes it from the cloud database.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">8. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Any changes will be reflected within the App.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-1">9. Contact</h3>
            <p>For privacy questions or requests, contact: <span className="text-emerald-400">support@calculator1plus.app</span></p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-emerald-500 text-black rounded-xl py-3 font-bold active:scale-95 transition-transform"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
