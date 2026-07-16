import { useState, useEffect } from 'react';
import { ClipboardList, Search, Building2 } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { makeInputStyle } from '../../components/shared/TextInput';
import { statToneColor, statToneBg } from '../../components/shared/statTone';
import { STATUS_OPTIONS, STATUS_TONE } from '../../data/referrals';

export function ReferralsTable({ referrals, onStatusChange }) {
  const COLOR = useColors();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const filtered = referrals.filter((r) => {
    const matchesQuery = `${r.patient} ${r.practice} ${r.treatment}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  useEffect(() => {
    setExpanded(false);
  }, [query, statusFilter]);

  const visible = expanded ? filtered : filtered.slice(0, 5);

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
          <ClipboardList size={16} style={{ color: COLOR.secondary }} /> All referrals
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLOR.textMuted }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient or practice" style={{ ...makeInputStyle(COLOR), paddingLeft: '2rem', fontSize: '13px' }} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...makeInputStyle(COLOR), fontSize: '13px' }}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <ul className="mt-4 divide-y" style={{ borderColor: COLOR.border }}>
        {filtered.length === 0 && (
          <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No referrals match your search.</li>
        )}
        {visible.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: COLOR.border }}>
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>{r.patient} · {r.treatment}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
                <Building2 size={12} /> {r.practice} · {r.date} · £{r.fee}
              </p>
            </div>
            <select
              value={r.status}
              onChange={(e) => onStatusChange(r.id, e.target.value)}
              className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: statToneBg(STATUS_TONE[r.status], COLOR), color: statToneColor(STATUS_TONE[r.status], COLOR), border: 'none', outline: 'none' }}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </li>
        ))}
      </ul>

      {!expanded && filtered.length > 5 && (
        <button
          onClick={() => setExpanded(true)}
          className="ecl-btn ecl-press mt-4 w-full rounded-lg py-2.5 text-sm font-medium"
          style={{ background: COLOR.recessed, color: COLOR.text, border: `1px solid ${COLOR.border}` }}
        >
          Show all {filtered.length} referrals
        </button>
      )}
      {expanded && filtered.length > 5 && (
        <button
          onClick={() => setExpanded(false)}
          className="ecl-underline mt-4 block text-center text-sm font-medium"
          style={{ color: COLOR.textMuted }}
        >
          Show less
        </button>
      )}
    </div>
  );
}
