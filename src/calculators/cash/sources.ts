/** Sources for the cash counter, checked on 2 November 2026. */
export const CASH_SOURCES = {
  /** Bangladesh Bank: notes in circulation. */
  notes: { title: "Bangladesh Bank: Currency notes", url: "https://www.bb.org.bd/en/index.php/currency/note" },
  /** Bangladesh Bank: the ৳200 note. */
  twoHundred: { title: "Bangladesh Bank: 200 taka note", url: "https://www.bb.org.bd/en/index.php/currency/twohundredtaka" },
  /** ৳1, ৳2 and ৳5 coins. */
  coins: { title: "Wikipedia: Bangladeshi taka", url: "https://en.wikipedia.org/wiki/Bangladeshi_taka" },
  /** Redesigned notes from 2025 circulate alongside the old ones. */
  newDesign: {
    title: "The Financial Express: Bangladesh rolls out redesigned Tk 5 note",
    url: "https://thefinancialexpress.com.bd/national/bangladesh-rolls-out-redesigned-tk-5-note-with-archaeological-theme",
  },
} as const;
