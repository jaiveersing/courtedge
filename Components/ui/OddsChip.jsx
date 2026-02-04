export function OddsChip({ odds, sportsbook, className = '' }) {
  const formatOdds = (odds) => {
    if (!odds) {
return 'N/A';
}
    const num = parseFloat(odds);
    if (num > 0) {
return `+${num}`;
}
    return num.toString();
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 ${className}`}>
      {sportsbook && <span className="text-xs text-slate-400">{sportsbook}</span>}
      <span className="text-sm font-semibold text-white">{formatOdds(odds)}</span>
    </div>
  );
}
