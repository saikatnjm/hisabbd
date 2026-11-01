/** Sources for the weight converter, checked on 1 November 2026. */
export const WEIGHT_SOURCES = {
  /** "সারাদেশে ৪০ কেজিতে এক মণ"; Baneshwar traders moved to a 40 kg মণ (October 2020). */
  market: {
    title: "ঢাকা টাইমস: তিন দশক পর ‘ঢলন’ প্রথা বিলুপ্ত (23 Oct 2020)",
    url: "https://www.dhakatimes24.com/2020/10/23/188566/%E0%A6%A4%E0%A6%BF%E0%A6%A8-%E0%A6%A6%E0%A6%B6%E0%A6%95-%E0%A6%AA%E0%A6%B0-%E0%A6%A2%E0%A6%B2%E0%A6%A8-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A5%E0%A6%BE-%E0%A6%AC%E0%A6%BF%E0%A6%B2%E0%A7%81%E0%A6%AA%E0%A7%8D%E0%A6%A4",
  },
  /** Baneshwar mango মণ of 48 kg against the national 40 kg. */
  baneshwar: {
    title: "প্রথম আলো: বানেশ্বর বাজারে ৪৮ কেজিতে আমের মণ আর হবে না",
    url: "https://www.prothomalo.com/bangladesh/district/বানেশ্বর-বাজারে-৪৮-কেজিতে-আমের-মণ-আর-হবে-না",
  },
  /** 1833 tola of 180 grains; the maund of 40 seers, 37.3242 kg. */
  traditional: {
    title: "Wikipedia: Maund (unit)",
    url: "https://en.wikipedia.org/wiki/Maund_(unit)",
  },
} as const;
