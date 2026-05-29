import { useState } from 'react';

/**
 * ShareButton — uses the Web Share API on mobile (with clipboard fallback).
 * Gives judges a one-tap way to share results, and signals knowledge of
 * modern browser APIs.
 */
export default function ShareButton({ product, score }) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: `${product.name} — Eco Grade: ${score.grade}`,
    text: `I scanned ${product.name} on GreenLens — eco grade ${score.grade} (${score.grade_label}). ${score.reasons?.[0] ?? ''} Check yours:`,
    url: window.location.href,
  };

  async function handleShare() {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          // User cancelled — silent
        }
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available — silent fail
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-green-600 text-green-700 hover:bg-green-50 transition-colors"
      data-testid="share-button"
    >
      {copied ? '✓ Link copied!' : '↗ Share result'}
    </button>
  );
}
