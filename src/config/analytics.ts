/** Umami website id. Analytics are completely off unless this is set. */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

export const analyticsEnabled = Boolean(UMAMI_WEBSITE_ID);
