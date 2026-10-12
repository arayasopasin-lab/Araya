"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatBaht, formatThaiDate } from "@/lib/format";
import { BOOKS, SHOPS, todayIso } from "@/lib/orders";
import { useOrders } from "@/lib/orders-store";

type Errors = Partial<Record<"shop" | "book" | "quantity" | "date", string>>;

const inputClass =
  "mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400";

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder } = useOrders();
  const [shop, setShop] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderDate, setOrderDate] = useState(todayIso);
  const [errors, setErrors] = useState<Errors>({});

  const book = BOOKS.find((b) => b.title === bookTitle);
  const qty = Number(quantity);
  const validQty = Number.isInteger(qty) && qty > 0;
  const total = book && validQty ? book.price * qty : 0;

  function validate(): Errors {
    const e: Errors = {};
    if (!shop) e.shop = "กรุณาเลือกร้าน";
    if (!book) e.book = "กรุณาเลือกหนังสือ";
    if (quantity.trim() === "") e.quantity = "กรุณาใส่จำนวน";
    else if (!validQty) e.quantity = "จำนวนต้องเป็นจำนวนเต็มที่มากกว่า 0";
    if (!orderDate) e.date = "กรุณาเลือกวันที่สั่ง";
    else if (orderDate > todayIso()) e.date = "วันที่สั่งต้องไม่เป็นวันในอนาคต";
    return e;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0 || !book) return;
    addOrder({ shopName: shop, bookTitle: book.title, quantity: qty, unitPrice: book.price, orderDate });
    router.push("/");
  }

  const border = (key: keyof Errors) => (errors[key] ? "border-red-400" : "border-gray-300");

  // แก้ช่องไหนแล้ว ให้ข้อความเตือนของช่องนั้นหายไป
  function clearError(key: keyof Errors) {
    if (!errors[key]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">เพิ่มคำสั่งซื้อ</h1>
        <p className="mt-1 text-sm text-gray-500">คำสั่งซื้อใหม่จะมีสถานะ &quot;รอส่ง&quot;</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง กรุณาตรวจสอบช่องที่มีข้อความสีแดง
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="shop" className="text-sm font-medium text-gray-700">ร้าน</label>
          <select id="shop" value={shop} onChange={(e) => { setShop(e.target.value); clearError("shop"); }} className={`${inputClass} ${border("shop")}`}>
            <option value="">-- เลือกร้าน --</option>
            {SHOPS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.shop && <p className="mt-1 text-sm text-red-600">{errors.shop}</p>}
        </div>

        <div>
          <label htmlFor="book" className="text-sm font-medium text-gray-700">หนังสือ</label>
          <select id="book" value={bookTitle} onChange={(e) => { setBookTitle(e.target.value); clearError("book"); }} className={`${inputClass} ${border("book")}`}>
            <option value="">-- เลือกหนังสือ --</option>
            {BOOKS.map((b) => (
              <option key={b.title} value={b.title}>
                {b.title} ({formatBaht(b.price)})
              </option>
            ))}
          </select>
          {errors.book && <p className="mt-1 text-sm text-red-600">{errors.book}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">จำนวน (เล่ม)</label>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={quantity}
              onChange={(e) => { setQuantity(e.target.value); clearError("quantity"); }}
              className={`${inputClass} ${border("quantity")}`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700">วันที่สั่ง</label>
            <input
              id="date"
              type="date"
              max={todayIso()}
              value={orderDate}
              onChange={(e) => { setOrderDate(e.target.value); clearError("date"); }}
              className={`${inputClass} ${border("date")}`}
            />
            {errors.date ? (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            ) : (
              orderDate && <p className="mt-1 text-sm text-gray-500">{formatThaiDate(orderDate)}</p>
            )}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>ราคาต่อเล่ม</span>
            <span className="tabular-nums">{book ? formatBaht(book.price) : "-"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">ยอดเงินรวม</span>
            <span className="text-xl font-semibold text-gray-900 tabular-nums">{formatBaht(total)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/")} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            ยกเลิก
          </button>
          <button type="submit" className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            บันทึกคำสั่งซื้อ
          </button>
        </div>
      </form>
    </div>
  );
}
