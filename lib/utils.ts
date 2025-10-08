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
