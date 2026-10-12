import { STATUS_LABELS, type OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  shipped: "bg-sky-50 text-sky-800 ring-sky-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
