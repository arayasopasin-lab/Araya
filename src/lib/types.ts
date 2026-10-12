export type OrderStatus = "pending" | "shipped" | "paid";

export type Order = {
  id: string;
  orderNo: string;
  shopName: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  /** วันที่สั่ง รูปแบบ YYYY-MM-DD (ค.ศ.) */
  orderDate: string;
  status: OrderStatus;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "รอส่ง",
  shipped: "ส่งแล้ว",
  paid: "ชำระแล้ว",
};
