import type { Order, OrderStatus } from "./types";

// ข้อมูลตั้งต้น ชื่อร้านและชื่อหนังสือเป็นชื่อสมมติทั้งหมด
export const SHOPS: string[] = [
  "ร้านหนังสือแสงตะวันวิทยา",
  "ร้านหนังสือหิ่งห้อยบุ๊คส์",
  "ร้านหนังสือปลายดินสอ",
  "ร้านหนังสือนาคราชพาณิชย์",
  "ร้านหนังสือกระดาษสีครีม",
  "ร้านหนังสือท่าน้ำสามแยก",
  "ร้านหนังสือดอกแก้วศึกษาภัณฑ์",
];

export type Book = { title: string; price: number };

export const BOOKS: Book[] = [
  { title: "สายลมเหนือทุ่งข้าว", price: 245 },
  { title: "ตำราอาหารบ้านริมน้ำ", price: 320 },
  { title: "คู่มือปลูกผักบนระเบียง", price: 189 },
  { title: "ประวัติศาสตร์เมืองท่าโบราณ", price: 450 },
  { title: "นิทานก่อนนอนของคุณยาย", price: 159 },
  { title: "เรียนภาษาญี่ปุ่นใน 90 วัน", price: 280 },
  { title: "บันทึกนักเดินทางคนสุดท้าย", price: 265 },
  { title: "คณิตคิดสนุก ป.4", price: 125 },
];

export const SAMPLE_ORDERS: Order[] = [
  { id: "1", orderNo: "SO-2569-001", shopName: SHOPS[0], bookTitle: BOOKS[0].title, quantity: 30, unitPrice: 245, orderDate: "2026-08-14", status: "paid" },
  { id: "2", orderNo: "SO-2569-002", shopName: SHOPS[1], bookTitle: BOOKS[1].title, quantity: 20, unitPrice: 320, orderDate: "2026-08-21", status: "shipped" },
  { id: "3", orderNo: "SO-2569-003", shopName: SHOPS[2], bookTitle: BOOKS[2].title, quantity: 15, unitPrice: 189, orderDate: "2026-08-28", status: "paid" },
  { id: "4", orderNo: "SO-2569-004", shopName: SHOPS[3], bookTitle: BOOKS[3].title, quantity: 12, unitPrice: 450, orderDate: "2026-09-02", status: "shipped" },
  { id: "5", orderNo: "SO-2569-005", shopName: SHOPS[4], bookTitle: BOOKS[4].title, quantity: 40, unitPrice: 159, orderDate: "2026-09-06", status: "pending" },
  { id: "6", orderNo: "SO-2569-006", shopName: SHOPS[0], bookTitle: BOOKS[5].title, quantity: 25, unitPrice: 280, orderDate: "2026-09-15", status: "paid" },
  { id: "7", orderNo: "SO-2569-007", shopName: SHOPS[5], bookTitle: BOOKS[6].title, quantity: 18, unitPrice: 265, orderDate: "2026-09-22", status: "shipped" },
  { id: "8", orderNo: "SO-2569-008", shopName: SHOPS[6], bookTitle: BOOKS[7].title, quantity: 60, unitPrice: 125, orderDate: "2026-09-29", status: "shipped" },
  { id: "9", orderNo: "SO-2569-009", shopName: SHOPS[1], bookTitle: BOOKS[0].title, quantity: 24, unitPrice: 245, orderDate: "2026-10-05", status: "pending" },
  { id: "10", orderNo: "SO-2569-010", shopName: SHOPS[2], bookTitle: BOOKS[4].title, quantity: 35, unitPrice: 159, orderDate: "2026-10-09", status: "pending" },
];

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "shipped",
  shipped: "paid",
};

export const OVERDUE_DAYS = 30;

export function orderTotal(order: Order): number {
  return order.quantity * order.unitPrice;
}

/** วันนี้ตามเวลาไทย รูปแบบ YYYY-MM-DD */
export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
}

export function daysSince(isoDate: string, today: string = todayIso()): number {
  const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${isoDate}T00:00:00Z`);
  return Math.floor(ms / 86_400_000);
}

/** ยังไม่ชำระและสั่งมาเกิน 30 วัน */
export function isOverdue(order: Order, today?: string): boolean {
  return order.status !== "paid" && daysSince(order.orderDate, today) > OVERDUE_DAYS;
}

/** เลขที่ถัดไป เช่น SO-2569-011 (ปี พ.ศ. ของวันที่สั่ง) */
export function nextOrderNo(orders: Order[], orderDate: string): string {
  const beYear = Number(orderDate.slice(0, 4)) + 543;
  const prefix = `SO-${beYear}-`;
  const max = orders
    .filter((o) => o.orderNo.startsWith(prefix))
    .reduce((m, o) => Math.max(m, Number(o.orderNo.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}
