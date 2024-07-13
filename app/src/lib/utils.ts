import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import { twMerge } from "tailwind-merge";
import { toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

toHex(new Uint8Array([1, 69, 420]));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(str: string) {
  const clipboard = window.navigator.clipboard;
  /*
   * fallback to older browsers (including Safari)
   * if clipboard API not supported
   */
  if (!clipboard || typeof clipboard.writeText !== `function`) {
    const textarea = document.createElement(`textarea`);
    textarea.value = str;
    textarea.readOnly = true;
    textarea.contentEditable = "true";
    textarea.style.position = `absolute`;
    textarea.style.left = `-9999px`;

    document.body.appendChild(textarea);
    textarea.select();

    const range = document.createRange();
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    textarea.setSelectionRange(0, textarea.value.length);

    document.execCommand(`copy`);
    document.body.removeChild(textarea);

    return Promise.resolve(true);
  }

  return clipboard.writeText(str);
}

export function getAddressExplorerLink(address: string) {
  return `https://etherscan.io/address/${address}`;
}

export function getDaysDifference(timestamp: bigint) {
  return Math.round((Number(timestamp) - Date.now()) / (1000 * 60 * 60 * 24));
}

export function deriveAccountFromUid(uid: string) {
  const hashedString = CryptoJS.SHA256(uid).toString();

  const buffer = Buffer.from(hashedString, "hex");
  const privateKey = toHex(buffer);

  return privateKeyToAccount(privateKey);
}
