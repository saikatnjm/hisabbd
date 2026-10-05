"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, ShareIcon } from "@/components/ui/icons";
import { useCalculatorSlug } from "@/components/calculator/calculator-context";
import { track } from "@/lib/analytics";

const subscribe = () => () => {};
const canShareSnapshot = () => typeof navigator.share === "function";
const serverSnapshot = () => false;

/**
 * Copy (Clipboard API) and Share (Web Share API) for a plain-text result.
 * Share only appears where the browser supports it; copy explains what to do if it fails.
 * Remount (via `key`) when the result changes to clear the status message.
 */
export function ResultActions({ text, shareTitle }: { text: string; shareTitle: string }) {
  const canShare = useSyncExternalStore(subscribe, canShareSnapshot, serverSnapshot);
  const [status, setStatus] = useState("");
  const slug = useCalculatorSlug();

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setStatus("Copied to clipboard.");
      if (slug) track({ name: "result_copied", calculator: slug });
    } catch {
      setStatus("Couldn’t copy automatically. Select the result and copy it manually.");
    }
  }

  async function share() {
    try {
      await navigator.share({ title: shareTitle, text, url: window.location.href });
      setStatus("");
      if (slug) track({ name: "result_shared", calculator: slug });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Sharing didn’t work here. Use “Copy result” instead.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copy}>
          <CopyIcon className="size-5" />
          Copy result
        </Button>
        {canShare && (
          <Button variant="secondary" onClick={share}>
            <ShareIcon className="size-5" />
            Share
          </Button>
        )}
      </div>
      <p role="status" className="mt-2 min-h-5 text-sm text-slate-700">
        {status}
      </p>
    </div>
  );
}
