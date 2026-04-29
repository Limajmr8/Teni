import MetricCard from '@/components/dashboard/metric-card';
import OrdersChart from '@/components/dashboard/orders-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Town dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Orders today" value="82" change="+12%" />
        <MetricCard label="GMV" value="₹22,300" change="+8%" />
        <MetricCard label="Active sellers" value="54" />
        <MetricCard label="Active runners" value="18" />
      </div>
      <OrdersChart />
    </div>
  );
}
