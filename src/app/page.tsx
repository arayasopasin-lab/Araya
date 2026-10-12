"use client";

import { StatusBadge } from "@/components/status-badge";
import { formatBaht, formatThaiDate } from "@/lib/format";
import { NEXT_STATUS, daysSince, isOverdue, orderTotal, todayIso } from "@/lib/orders";
import { useOrders } from "@/lib/orders-store";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { useState } from "react";

type StatusFilter = "all" | OrderStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: STATUS_LABELS.pending },
  { value: "shipped", label: STATUS_LABELS.shipped },
  { value: "paid", label: STATUS_LABELS.paid },
];

export default function OrdersPage() {
  const { orders, loaded, advanceStatus } = useOrders();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const today = todayIso();
  const keyword = query.trim().toLowerCase();
  const matchesQuery = (o: (typeof orders)[number]) =>
    !keyword || o.shopName.toLowerCase().includes(keyword) || o.bookTitle.toLowerCase().includes(keyword);
  const sorted = orders
    .filter((o) => matchesQuery(o) && (statusFilter === "all" || o.status === statusFilter))
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate) || b.orderNo.localeCompare(a.orderNo));
  const countFor = (value: StatusFilter) =>
    orders.filter((o) => matchesQuery(o) && (value === "all" || o.status === value)).length;
  const overdueCount = orders.filter((o) => isOverdue(o, today)).length;
  const filtering = keyword !== "" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">รายการคำสั่งซื้อ</h1>
        <p className="mt-1 text-sm text-gray-500">
          คำสั่งซื้อทั้งหมด {orders.length.toLocaleString("th-TH")} รายการ เรียงจากล่าสุด
          {overdueCount > 0 && (
            <span className="text-red-700">
              {" "}· ค้างชำระเกิน 30 วัน {overdueCount.toLocaleString("th-TH")} รายการ (แถวสีแดง)
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="search" className="sr-only">ค้นหาชื่อร้านหรือชื่อหนังสือ</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อร้านหรือชื่อหนังสือ"
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div role="group" aria-label="กรองตามสถานะ" className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-slate-800 bg-slate-800 text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 tabular-nums ${active ? "text-slate-300" : "text-gray-400"}`}>
                  {countFor(f.value).toLocaleString("th-TH")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">เลขที่</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">ร้าน</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">หนังสือ</th>
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">จำนวน</th>
              <th className="px-4 py-3 text-right font-medium whitespace-nowrap">ยอดเงิน</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">วันที่สั่ง</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">สถานะ</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!loaded && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            )}
            {loaded && sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  {filtering ? "ไม่พบคำสั่งซื้อที่ตรงกับการค้นหา" : "ยังไม่มีคำสั่งซื้อ"}
                </td>
              </tr>
            )}
            {sorted.map((order) => {
              const overdue = isOverdue(order, today);
              const next = NEXT_STATUS[order.status];
              return (
                <tr
                  key={order.id}
                  className={overdue ? "bg-red-50 text-red-900 hover:bg-red-100" : "hover:bg-gray-50"}
                >
                  <td className={`px-4 py-3 whitespace-nowrap tabular-nums ${overdue ? "border-l-4 border-red-500" : "border-l-4 border-transparent text-gray-500"}`}>
                    {order.orderNo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.shopName}</td>
                  <td className="min-w-48 px-4 py-3">{order.bookTitle}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                    {order.quantity.toLocaleString("th-TH")} เล่ม
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-medium tabular-nums">
                    {formatBaht(orderTotal(order))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatThaiDate(order.orderDate)}
                    {overdue && (
                      <span className="block text-xs font-medium text-red-700">
                        ค้าง {daysSince(order.orderDate, today).toLocaleString("th-TH")} วัน
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {next ? (
                      <button
                        type="button"
                        onClick={() => advanceStatus(order.id)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        เปลี่ยนเป็น {STATUS_LABELS[next]}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">เสร็จสิ้น</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
