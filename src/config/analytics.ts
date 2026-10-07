/** Umami website id. Umami is off unless this is set. */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

/** Google Analytics 4 measurement id (G-XXXXXXXXXX). GA is off unless this is set. */
const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
export const GA_MEASUREMENT_ID = rawGaId && /^G-[A-Z0-9]+$/i.test(rawGaId) ? rawGaId : undefined;

export const umamiEnabled = Boolean(UMAMI_WEBSITE_ID);
export const gaEnabled = Boolean(GA_MEASUREMENT_ID);
export const analyticsEnabled = umamiEnabled || gaEnabled;
