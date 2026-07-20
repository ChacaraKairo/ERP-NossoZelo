export function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "danger" }) {
  return (
    <div className="card metric">
      <span>{label}</span>
      <strong className={tone ? `badge ${tone}` : undefined} style={{ fontSize: tone ? 24 : undefined }}>
        {value}
      </strong>
    </div>
  );
}
