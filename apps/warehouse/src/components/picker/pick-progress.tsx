interface PickProgressProps {
  picked: number;
  total: number;
}

export default function PickProgress({ picked, total }: PickProgressProps) {
  const percentage = Math.round((picked / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-bazar-text/60">
        <span>{picked} of {total} items picked</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-bazar-border">
        <div className="h-2 rounded-full bg-bazar-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
