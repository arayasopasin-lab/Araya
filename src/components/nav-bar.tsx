"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "รายการคำสั่งซื้อ" },
  { href: "/orders/new", label: "เพิ่มคำสั่งซื้อ" },
  { href: "/summary", label: "สรุปยอด" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-semibold text-gray-900">สำนักพิมพ์อมตะ</p>
          <p className="text-sm text-gray-500">ระบบติดตามคำสั่งซื้อหนังสือ</p>
        </div>
        <nav className="flex flex-wrap gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
