const bahtFormatter = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 12345 -> "฿12,345.00" */
export function formatBaht(amount: number): string {
  return `฿${bahtFormatter.format(amount)}`;
}

const thaiDateFormatter = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Bangkok",
});

/** "2026-10-12" -> "12 ต.ค. 2569" */
export function formatThaiDate(isoDate: string): string {
  return thaiDateFormatter.format(new Date(`${isoDate}T00:00:00+07:00`));
}
