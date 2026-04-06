import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { getPrimaryMediaUrl } from "@/lib/mediaUrls";

// -- Types --

export interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

export interface StorageFile {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, unknown> | null;
}

// Stub: storage is managed via Convex. Buckets list can be extended when Convex file storage is wired.
const STUB_BUCKETS: StorageBucket[] = [
  { id: "oemwdb images", name: "oemwdb images", public: true, owner: "", created_at: "", updated_at: "" },
];

export function useBuckets() {
  return useQuery({
    queryKey: ["storage", "buckets"],
    queryFn: async () => STUB_BUCKETS,
  });
}

export function useFiles(bucketName: string, path: string = "") {
  return useQuery({
    queryKey: ["storage", "files", bucketName, path],
    queryFn: async (): Promise<StorageFile[]> => {
      if (!bucketName) return [];
      return [];
    },
    enabled: !!bucketName,
  });
}

export function useStorageActions() {
  const queryClient = useQueryClient();

  const createBucket = useMutation({
    mutationFn: async (_args: { name: string; isPublic?: boolean }) => {
      toast.info("Bucket creation is not available. Use Convex dashboard for file storage.");
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage", "buckets"] });
    },
  });

  const deleteBucket = useMutation({
    mutationFn: async (_id: string) => {
      toast.info("Bucket deletion is not available. Use Convex dashboard for file storage.");
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storage", "buckets"] });
    },
  });

  const getMimeType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
      bmp: "image/bmp",
      tiff: "image/tiff",
      tif: "image/tiff",
      pdf: "application/pdf",
      txt: "text/plain",
      json: "application/json",
      mp4: "video/mp4",
      zip: "application/zip",
    };
    return mimeTypes[ext] || "application/octet-stream";
  };

  const uploadFile = useMutation({
    mutationFn: async (_args: { bucket: string; path: string; file: File }) => {
      toast.info("Upload is not available. Use Convex file storage when wired.");
      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
      queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket, variables.path] });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (_args: { bucket: string; path: string }) => {
      toast.info("Delete is not available. Use Convex dashboard for file storage.");
      return null;
    },
    onSuccess: (_, variables) => {
      const parentPath = variables.path.includes("/") ? variables.path.substring(0, variables.path.lastIndexOf("/")) : "";
      queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket, parentPath] });
      queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
    },
  });

  const getPublicUrl = (bucket: string, path: string) => {
    return getPrimaryMediaUrl(path, bucket) ?? "";
  };

  const moveFile = useMutation({
    mutationFn: async (_args: { bucket: string; fromPath: string; toPath: string; isFolder?: boolean; preserveSourceFolder?: boolean }) => {
      toast.info("Move is not available. Use Convex dashboard for file storage.");
      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
    },
  });

  return {
    createBucket,
    deleteBucket,
    uploadFile,
    deleteFile,
    getPublicUrl,
    moveFile,
  };
}
