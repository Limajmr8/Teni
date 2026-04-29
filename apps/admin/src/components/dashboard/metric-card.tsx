interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
}

export default function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-bazar-border bg-white p-4 shadow-card">
      <p className="text-xs text-bazar-text/60">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {change ? <p className="text-xs text-bazar-primary">{change}</p> : null}
    </div>
  );
}
