import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import { twMerge } from "tailwind-merge";
import { toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

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
  const timestampInMilliseconds = Number(timestamp) * 1000;
  return Math.round((timestampInMilliseconds - Date.now()) / (1000 * 60 * 60 * 24));
}

export function deriveAccountFromUid(uid: string) {
  const hashedString = CryptoJS.SHA256(uid).toString();

  const buffer = Buffer.from(hashedString, "hex");
  const privateKey = toHex(buffer);

  console.log("Private Key: ", privateKey);

  return privateKeyToAccount(privateKey);
}

export const APR_DECIMALS = 2;

export const LTV_DECIMALS = 0;

export function padAddress(address: string) {
  return "0x".concat(address.slice(2).padStart(64, "0")) as `0x${string}`;
}
