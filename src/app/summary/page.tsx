"use client";

import { StatusBadge } from "@/components/status-badge";
import { formatBaht } from "@/lib/format";
import { orderTotal } from "@/lib/orders";
import { useOrders } from "@/lib/orders-store";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "shipped", "paid"];

export default function SummaryPage() {
  const { orders, loaded } = useOrders();

  const totalSales = orders.reduce((sum, o) => sum + orderTotal(o), 0);
  const unpaid = orders.filter((o) => o.status !== "paid");
  const unpaidTotal = unpaid.reduce((sum, o) => sum + orderTotal(o), 0);
  const countByStatus = Object.fromEntries(
    STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length]),
  ) as Record<OrderStatus, number>;

  const byShop = new Map<string, number>();
  for (const o of orders) byShop.set(o.shopName, (byShop.get(o.shopName) ?? 0) + orderTotal(o));
  const topShops = [...byShop.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxShop = topShops[0]?.[1] ?? 0;

  if (!loaded) return <p className="text-gray-400">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">สรุปยอด</h1>
        <p className="mt-1 text-sm text-gray-500">คำนวณจากคำสั่งซื้อทั้งหมด {orders.length.toLocaleString("th-TH")} รายการ</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">ยอดขายรวม</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 tabular-nums">{formatBaht(totalSales)}</p>
          <p className="mt-1 text-sm text-gray-500">{orders.length.toLocaleString("th-TH")} คำสั่งซื้อ</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">ยอดค้างชำระรวม</p>
          <p className="mt-2 text-3xl font-semibold text-red-700 tabular-nums">{formatBaht(unpaidTotal)}</p>
          <p className="mt-1 text-sm text-gray-500">{unpaid.length.toLocaleString("th-TH")} คำสั่งซื้อที่ยังไม่ชำระ</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATUSES.map((s) => (
          <div key={s} className="rounded-lg border border-gray-200 bg-white p-5">
            <StatusBadge status={s} />
            <p className="mt-3 text-2xl font-semibold text-gray-900 tabular-nums">
              {countByStatus[s].toLocaleString("th-TH")}
              <span className="ml-1 text-sm font-normal text-gray-500">คำสั่งซื้อ</span>
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">ร้านที่ยอดสูงสุด 5 อันดับ</h2>
        <p className="mt-1 text-sm text-gray-500">ยอดสั่งซื้อรวมทุกสถานะ</p>
        <ol className="mt-5 space-y-4">
          {topShops.map(([name, amount], i) => (
            <li key={name} title={`${name}: ${formatBaht(amount)}`} className="group">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-gray-700">
                  <span className="mr-2 text-gray-400 tabular-nums">{i + 1}.</span>
                  {name}
                </span>
                <span className="font-medium text-gray-900 tabular-nums">{formatBaht(amount)}</span>
              </div>
              <div className="mt-1.5 h-3 w-full rounded bg-gray-100">
                <div
                  className="h-3 rounded bg-slate-600 transition-colors group-hover:bg-slate-800"
                  style={{ width: `${maxShop ? (amount / maxShop) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
