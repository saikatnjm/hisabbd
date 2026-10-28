/*
 * "Share as image": draws a branded 1080×1080 result card on a canvas in the
 * visitor's browser. Nothing is uploaded; the PNG goes only where the visitor
 * shares or saves it. The browser does the text shaping, so Bangla renders
 * correctly (unlike server-side renderers such as next/og).
 */

export const CARD_SIZE = 1080;
const PADDING = 88;

/** Drops the "Calculated with HisabBD…" sentence the share texts end with; the card has its own branding. */
export function cardText(shareText: string): string {
  const sentences = shareText.split(/(?<=[.।!?])\s+/);
  const kept = sentences.filter((s) => !/HisabBD/.test(s));
  return (kept.length > 0 ? kept : sentences).join(" ").trim();
}

/**
 * Greedy word wrap. `measure` returns a string's width; words longer than
 * `maxWidth` get a line to themselves rather than being cut.
 */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measure(candidate) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export interface ResultCard {
  calculatorName: string;
  text: string;
  /** e.g. "bd-hisab.vercel.app/calculators/age-calculator" */
  pageLabel: string;
  tagline: string;
}

/** CSS font family of the site's display face (next/font sets it as --font-anek). */
function displayFamily(): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-anek").trim();
  return family || "system-ui, sans-serif";
}

/** Draws the card and returns it as a PNG blob. */
export async function renderResultCard(card: ResultCard): Promise<Blob> {
  const family = displayFamily();
  await Promise.all([document.fonts.load(`700 64px ${family}`), document.fonts.load(`500 40px ${family}`)]).catch(
    () => undefined,
  );

  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Background: brand-50 with graph paper, a green band at the top.
  ctx.fillStyle = "#eef9f3";
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);
  ctx.strokeStyle = "rgba(0, 106, 78, 0.08)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= CARD_SIZE; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CARD_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(CARD_SIZE, x);
    ctx.stroke();
  }
  ctx.fillStyle = "#006a4e";
  ctx.fillRect(0, 0, CARD_SIZE, 16);

  // Logo tile (÷) and wordmark.
  ctx.fillStyle = "#006a4e";
  ctx.beginPath();
  ctx.roundRect(PADDING, PADDING, 88, 88, 20);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 64px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("÷", PADDING + 44, PADDING + 48);
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 48px ${family}`;
  ctx.fillText("HisabBD", PADDING + 112, PADDING + 46);

  // Calculator name.
  const width = CARD_SIZE - PADDING * 2;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#005740";
  ctx.font = `700 56px ${family}`;
  let y = PADDING + 200;
  for (const line of wrapText(card.calculatorName, width, (s) => ctx.measureText(s).width).slice(0, 2)) {
    ctx.fillText(line, PADDING, y);
    y += 70;
  }

  // Result text in a white panel sized to the text: the biggest font that
  // fits (short results get large type), centred in the space left.
  const areaTop = y + 10;
  const areaBottom = CARD_SIZE - PADDING - 120;
  const inner = 48;
  let size = 72;
  let lines: string[] = [];
  for (; size >= 30; size -= 2) {
    ctx.font = `600 ${size}px ${family}`;
    lines = wrapText(card.text, width - inner * 2, (s) => ctx.measureText(s).width);
    if (lines.length * size * 1.4 <= areaBottom - areaTop - inner * 2) break;
  }
  const lineHeight = size * 1.4;
  const maxLines = Math.max(1, Math.floor((areaBottom - areaTop - inner * 2) / lineHeight));
  const shown = lines.slice(0, maxLines);
  const panelHeight = shown.length * lineHeight + inner * 2;
  const panelTop = areaTop + Math.max(0, (areaBottom - areaTop - panelHeight) / 2);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(PADDING, panelTop, width, panelHeight, 28);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  let lineY = panelTop + inner + size;
  for (const line of shown) {
    ctx.fillText(line, PADDING + inner, lineY);
    lineY += lineHeight;
  }

  // Footer: tagline and page.
  ctx.fillStyle = "#334155";
  ctx.font = `500 34px ${family}`;
  ctx.fillText(card.tagline, PADDING, CARD_SIZE - PADDING - 52);
  ctx.fillStyle = "#006a4e";
  ctx.font = `600 32px ${family}`;
  ctx.fillText(card.pageLabel, PADDING, CARD_SIZE - PADDING);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image failed"))), "image/png"),
  );
}
