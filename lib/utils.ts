import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from 'expo-file-system';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatDate = (dateString: number) => {
        if (dateString ===0) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
export function currentYear(): number {
  return new Date().getFullYear();
}

/**
 * Return a short relative time string like "1s ago", "3m ago", "2h ago", "5d ago", "3mo ago", "2y ago".
 * Accepts Date | number | string. number can be millis or seconds (heuristic: if < 10^12 treat as seconds).
 * Future dates return "in X" (e.g. "in 3m"). Invalid inputs return "".
 */
export function timeAgo(input: Date | number | string): string {
  if (input == null) return "";
  let date: Date;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'number') {
    // If it's clearly a unix seconds timestamp (< 10^12) convert to ms
    const ms = input < 1_000_000_000_000 ? input * 1000 : input;
    date = new Date(ms);
  } else if (typeof input === 'string') {
    const parsed = Date.parse(input);
    if (isNaN(parsed)) return "";
    date = new Date(parsed);
  } else {
    return "";
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const future = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const sec = 1000;
  const min = 60 * sec;
  const hour = 60 * min;
  const day = 24 * hour;
  const month = 30 * day; // approximate month
  const year = 365 * day; // approximate year

  let value: number;
  let unit: string;
  if (absMs < min) {
    value = Math.floor(absMs / sec) || 0;
    unit = 's';
  } else if (absMs < hour) {
    value = Math.floor(absMs / min);
    unit = 'm';
  } else if (absMs < day) {
    value = Math.floor(absMs / hour);
    unit = 'h';
  } else if (absMs < month) {
    value = Math.floor(absMs / day);
    unit = 'd';
  } else if (absMs < year) {
    value = Math.floor(absMs / month);
    unit = 'mo';
  } else {
    value = Math.floor(absMs / year);
    unit = 'y';
  }

  // Edge case: exactly now
  if (value === 0) return future ? 'soon' : 'now';

  return future ? `in ${value}${unit}` : `${value}${unit} ago`;
}

export async function uploadImage(imageUri: string) {
        // const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
        // const postUrl = await generateUploadUrl();


  // Step 2: Upload the image
  const file = await fetch(imageUri);
  const blob = await file.blob();

//   const uploadResponse = await fetch(postUrl, {
//     method: "POST",
//     headers: { "Content-Type": blob.type },
//     body: blob,
//   });

//   const { storageId } = await uploadResponse.json();

//   console.log("Uploaded to Convex storage:", storageId);
  return blob;
}
