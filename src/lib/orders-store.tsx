"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NEXT_STATUS, SAMPLE_ORDERS, nextOrderNo } from "./orders";
import type { Order } from "./types";

// รอบแรกเก็บข้อมูลไว้ในเบราว์เซอร์ (localStorage)
// ช่วงบ่ายเปลี่ยนเฉพาะไฟล์นี้ให้อ่าน/เขียน Supabase โดยหน้าจอไม่ต้องแก้
const STORAGE_KEY = "amata-orders-v1";

export type NewOrderInput = Omit<Order, "id" | "orderNo" | "status">;

type OrdersContextValue = {
  orders: Order[];
  loaded: boolean;
  addOrder: (input: NewOrderInput) => Order;
  advanceStatus: (id: string) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

function readStorage(): Order[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    // อ่านไม่ได้ ใช้ข้อมูลตัวอย่างแทน
  }
  return SAMPLE_ORDERS;
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- โหลดจาก localStorage ได้หลัง mount เท่านั้น
    setOrders(readStorage());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // บันทึกไม่ได้ ข้อมูลยังอยู่จนกว่าจะปิดหน้า
    }
  }, [orders, loaded]);

  const addOrder = useCallback(
    (input: NewOrderInput) => {
      const order: Order = {
        ...input,
        id: crypto.randomUUID(),
        orderNo: nextOrderNo(orders, input.orderDate),
        status: "pending",
      };
      setOrders((prev) => [...prev, order]);
      return order;
    },
    [orders],
  );

  const advanceStatus = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        const next = NEXT_STATUS[o.status];
        return o.id === id && next ? { ...o, status: next } : o;
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ orders, loaded, addOrder, advanceStatus }),
    [orders, loaded, addOrder, advanceStatus],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders ต้องใช้ภายใน OrdersProvider");
  return ctx;
}
