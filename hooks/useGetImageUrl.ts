import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useImageUrl(imageId: Id<"_storage"> | null | undefined) {
  // Use "skip" if imageId is not provided
  const url = useQuery(
    api.image.getImageUrl,
    imageId ? { imageId } : "skip"
  );
  return url;
}
