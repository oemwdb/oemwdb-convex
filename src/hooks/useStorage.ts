
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    metadata: Record<string, any> | null;
}

// -- Hooks --

export function useBuckets() {
    return useQuery({
        queryKey: ["storage", "buckets"],
        queryFn: async () => {
            const { data, error } = await supabase.storage.listBuckets();

            if (error || !data || data.length === 0) {
                console.warn("[useStorage] List buckets failed or empty, using fallback list.");
                return [
                    { id: 'oemwdb images', name: 'oemwdb images', public: true, owner: '', created_at: '', updated_at: '' },
                ] as StorageBucket[];
            }
            // Filter to only 'oemwdb images' if needed, or return all
            return data as StorageBucket[];
        },
    });
}

export function useFiles(bucketName: string, path: string = "") {
    return useQuery({
        queryKey: ["storage", "files", bucketName, path],
        queryFn: async () => {
            if (!bucketName) return [];
            // Supabase list returns files in the folder.
            const { data, error } = await supabase.storage.from(bucketName).list(path, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

            if (error) throw error;
            return data as StorageFile[];
        },
        enabled: !!bucketName,
    });
}

export function useStorageActions() {
    const queryClient = useQueryClient();

    // Create Bucket
    const createBucket = useMutation({
        mutationFn: async ({ name, isPublic = true }: { name: string, isPublic?: boolean }) => {
            const { data, error } = await supabase.storage.createBucket(name, { public: isPublic });
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storage", "buckets"] });
            toast.success("Bucket created successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to create bucket: ${error.message}`);
        }
    });

    // Delete Bucket
    const deleteBucket = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase.storage.deleteBucket(id);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storage", "buckets"] });
            toast.success("Bucket deleted successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to delete bucket: ${error.message}`);
        }
    });

    // Upload File
    const uploadFile = useMutation({
        mutationFn: async ({ bucket, path, file }: { bucket: string, path: string, file: File }) => {
            const filePath = path ? `${path}/${file.name}` : file.name;
            const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
                upsert: true
            });
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
            // Also invalidate current path specifically
            queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket, variables.path] });
            toast.success("File uploaded successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to upload file: ${error.message}`);
        }
    });

    // Delete File
    const deleteFile = useMutation({
        mutationFn: async ({ bucket, path }: { bucket: string, path: string }) => {
            const { data, error } = await supabase.storage.from(bucket).remove([path]);
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate parent folder (we get path to file, need implementation logic to handle folder invalidation more robustly, but general refetch works)
            queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
            toast.success("File deleted successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to delete file: ${error.message}`);
        }
    });

    // Get Public URL
    const getPublicUrl = (bucket: string, path: string) => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    };

    return {
        createBucket,
        deleteBucket,
        uploadFile,
        deleteFile,
        getPublicUrl
    };
}
