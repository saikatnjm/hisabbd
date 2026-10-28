"use client";

import { useState, useSyncExternalStore } from "react";
import { shareablePath } from "@/calculators/paths";
import { Button } from "@/components/ui/button";
import { CopyIcon, ImageIcon, PrinterIcon, ShareIcon } from "@/components/ui/icons";
import { useCalculatorName, useCalculatorSlug } from "@/components/calculator/calculator-context";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { cardText, renderResultCard } from "@/lib/result-card";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";

const subscribe = () => () => {};
const canShareSnapshot = () => typeof navigator.share === "function";
const serverSnapshot = () => false;

/**
 * Actions for a result:
 * - Copy (Clipboard API) and Share (Web Share API) for the plain-text result.
 * - Share as image: a branded card drawn on the device, shared through the
 *   share sheet where files can be shared, otherwise downloaded.
 * - Print / Save as PDF via the print stylesheet.
 *
 * Share only appears where the browser supports it; copy explains what to do
 * if it fails. Remount (via `key`) when the result changes to clear the status
 * message.
 */
export function ResultActions({ text, shareTitle }: { text: string; shareTitle: string }) {
  const locale = useLocale();
  const t = ui[locale].actions;
  const canShare = useSyncExternalStore(subscribe, canShareSnapshot, serverSnapshot);
  const [status, setStatus] = useState("");
  const slug = useCalculatorSlug();
  const calculatorName = useCalculatorName();
  const [busy, setBusy] = useState(false);

  /** The full calculator page, even when the widget is embedded on another site. */
  const pageUrl = () => `${window.location.origin}${shareablePath(window.location.pathname)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${pageUrl()}`);
      setStatus(t.copied);
      if (slug) track({ name: "result_copied", calculator: slug });
    } catch {
      setStatus(t.copyFailed);
    }
  }

  async function share() {
    try {
      await navigator.share({ title: shareTitle, text, url: pageUrl() });
      setStatus("");
      if (slug) track({ name: "result_shared", calculator: slug });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus(t.shareFailed);
    }
  }

  async function shareImage() {
    setBusy(true);
    try {
      const url = pageUrl();
      const blob = await renderResultCard({
        calculatorName,
        text: cardText(text),
        pageLabel: url.replace(/^https?:\/\//, ""),
        tagline: locale === "bn" ? siteConfig.taglineBn : siteConfig.tagline,
      });
      const file = new File([blob], `hisabbd-${slug ?? "result"}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: shareTitle, text: url });
          setStatus("");
          if (slug) track({ name: "result_image_shared", calculator: slug, method: "share" });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus(t.imageSaved);
      if (slug) track({ name: "result_image_shared", calculator: slug, method: "download" });
    } catch {
      setStatus(t.imageFailed);
    } finally {
      setBusy(false);
    }
  }

  function print() {
    if (slug) track({ name: "result_printed", calculator: slug });
    window.print();
  }

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copy}>
          <CopyIcon className="size-5" />
          {t.copyResult}
        </Button>
        {canShare && (
          <Button variant="secondary" onClick={share}>
            <ShareIcon className="size-5" />
            {t.share}
          </Button>
        )}
        <Button variant="secondary" onClick={shareImage} disabled={busy}>
          <ImageIcon className="size-5" />
          {t.shareImage}
        </Button>
        <Button variant="secondary" onClick={print}>
          <PrinterIcon className="size-5" />
          {t.print}
        </Button>
      </div>
      <p role="status" className="mt-2 min-h-5 text-sm text-slate-700">
        {status}
      </p>
    </div>
  );
}
