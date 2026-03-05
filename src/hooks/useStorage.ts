
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

    // Helper: Get MIME type from file extension
    const getMimeType = (filename: string): string => {
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
            // Images
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon',
            'bmp': 'image/bmp',
            'tiff': 'image/tiff',
            'tif': 'image/tiff',
            // Documents
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // Text
            'txt': 'text/plain',
            'csv': 'text/csv',
            'json': 'application/json',
            'xml': 'application/xml',
            // Media
            'mp3': 'audio/mpeg',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mov': 'video/quicktime',
            // Archives
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    };

    // Upload File
    const uploadFile = useMutation({
        mutationFn: async ({ bucket, path, file }: { bucket: string, path: string, file: File }) => {
            const filePath = path ? `${path}/${file.name}` : file.name;

            // Determine the correct MIME type:
            // 1. Use file.type if it's valid and not octet-stream
            // 2. Otherwise, detect from extension
            // 3. For images, default to image/png if we can't determine
            let mimeType = file.type;

            if (!mimeType || mimeType === 'application/octet-stream' || mimeType === '') {
                mimeType = getMimeType(file.name);

                // If still octet-stream and it looks like an image file, default to image/png
                if (mimeType === 'application/octet-stream') {
                    const ext = file.name.split('.').pop()?.toLowerCase() || '';
                    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff', 'tif'].includes(ext)) {
                        mimeType = 'image/png'; // Safe fallback for images
                    }
                }
            }

            console.log('[Upload Debug] Filename:', file.name, 'Original type:', file.type, 'Final MIME:', mimeType);

            // Create a new File with the correct MIME type
            const fileWithCorrectType = new File([file], file.name, { type: mimeType });

            const { data, error } = await supabase.storage.from(bucket).upload(filePath, fileWithCorrectType, {
                upsert: true,
                contentType: mimeType
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

    // Helper: List all files in a folder recursively (moved up for use in deleteFile)
    const listFilesRecursivelyForDelete = async (bucket: string, folderPath: string): Promise<string[]> => {
        const allFiles: string[] = [];

        const { data, error } = await supabase.storage.from(bucket).list(folderPath, {
            limit: 1000,
        });

        if (error || !data) return allFiles;

        for (const item of data) {
            const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;

            // If no id, it's a folder - recurse
            if (!item.id) {
                const subFiles = await listFilesRecursivelyForDelete(bucket, itemPath);
                allFiles.push(...subFiles);
            } else {
                // It's a file
                allFiles.push(itemPath);
            }
        }

        return allFiles;
    };

    // Delete File or Folder
    const deleteFile = useMutation({
        mutationFn: async ({ bucket, path }: { bucket: string, path: string }) => {
            // First, check if this path is a folder (has contents)
            const { data: folderContents } = await supabase.storage.from(bucket).list(path, { limit: 1 });

            if (folderContents && folderContents.length > 0) {
                // It's a folder - delete all files inside recursively
                const allFiles = await listFilesRecursivelyForDelete(bucket, path);

                if (allFiles.length > 0) {
                    const { error } = await supabase.storage.from(bucket).remove(allFiles);
                    if (error) throw error;
                }

                return { deleted: allFiles.length, type: 'folder' };
            } else {
                // It's a single file
                const { data, error } = await supabase.storage.from(bucket).remove([path]);
                if (error) throw error;
                return data;
            }
        },
        onSuccess: (result, variables) => {
            // Calculate the parent folder path from the file path
            const parentPath = variables.path.includes('/')
                ? variables.path.substring(0, variables.path.lastIndexOf('/'))
                : '';

            // Invalidate the specific parent folder query
            queryClient.invalidateQueries({
                queryKey: ["storage", "files", variables.bucket, parentPath],
                refetchType: 'all'
            });

            // Invalidate root path
            queryClient.invalidateQueries({
                queryKey: ["storage", "files", variables.bucket, ""],
                refetchType: 'all'
            });

            // Also invalidate all queries for this bucket to catch any stale data
            queryClient.invalidateQueries({
                queryKey: ["storage", "files", variables.bucket],
                refetchType: 'all'
            });

            // Show appropriate toast
            if (result && typeof result === 'object' && 'type' in result && result.type === 'folder') {
                toast.success(`Folder deleted (${result.deleted} files removed)`);
            } else {
                toast.success("Deleted successfully");
            }
        },
        onError: (error: any) => {
            toast.error(`Failed to delete: ${error.message}`);
        }
    });

    // Get Public URL
    const getPublicUrl = (bucket: string, path: string) => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    };

    // Helper: List all files in a folder recursively
    const listFilesRecursively = async (bucket: string, folderPath: string): Promise<string[]> => {
        const allFiles: string[] = [];

        const { data, error } = await supabase.storage.from(bucket).list(folderPath, {
            limit: 1000,
        });

        if (error || !data) return allFiles;

        for (const item of data) {
            const itemPath = folderPath ? `${folderPath}/${item.name}` : item.name;

            // If no id, it's a folder - recurse
            if (!item.id) {
                const subFiles = await listFilesRecursively(bucket, itemPath);
                allFiles.push(...subFiles);
            } else {
                // It's a file
                allFiles.push(itemPath);
            }
        }

        return allFiles;
    };

    // Helper: Create a placeholder file to keep a folder alive
    const createFolderPlaceholder = async (bucket: string, folderPath: string) => {
        // Create a 1x1 transparent PNG as placeholder
        const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const binaryString = atob(pngBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/png' });
        const file = new File([blob], '.folder.png', { type: 'image/png' });

        const placeholderPath = folderPath ? `${folderPath}/.folder.png` : '.folder.png';
        await supabase.storage.from(bucket).upload(placeholderPath, file, { upsert: true });
    };

    // Move/Rename File or Folder
    const moveFile = useMutation({
        mutationFn: async ({ bucket, fromPath, toPath, isFolder = false, preserveSourceFolder = true }: { bucket: string, fromPath: string, toPath: string, isFolder?: boolean, preserveSourceFolder?: boolean }) => {
            // Check if source is a folder by trying to list its contents
            const { data: folderContents } = await supabase.storage.from(bucket).list(fromPath, { limit: 1 });
            const sourceIsFolder = folderContents && folderContents.length > 0;

            // Get the parent folder of the source item
            const sourceParentFolder = fromPath.includes('/')
                ? fromPath.substring(0, fromPath.lastIndexOf('/'))
                : '';

            if (sourceIsFolder || isFolder) {
                // Move folder: need to move all files inside recursively
                const allFiles = await listFilesRecursively(bucket, fromPath);

                if (allFiles.length === 0) {
                    throw new Error("Folder is empty or doesn't exist");
                }

                // Move each file to its new location
                for (const filePath of allFiles) {
                    // Calculate new path by replacing the source folder with destination
                    const relativePath = filePath.substring(fromPath.length);
                    const newFilePath = toPath + relativePath;

                    const { error } = await supabase.storage.from(bucket).move(filePath, newFilePath);
                    if (error) throw error;
                }

                return { message: `Moved ${allFiles.length} files`, sourceParentFolder };
            } else {
                // Single file move
                const { data, error } = await supabase.storage.from(bucket).move(fromPath, toPath);
                if (error) throw error;

                // Check if moving this file would leave the source folder empty
                if (preserveSourceFolder && sourceParentFolder) {
                    const { data: remainingFiles } = await supabase.storage.from(bucket).list(sourceParentFolder, { limit: 2 });

                    // If folder is now empty (or only has .folder.png), create a placeholder
                    const nonPlaceholderFiles = remainingFiles?.filter(f => f.name !== '.folder.png') || [];
                    if (nonPlaceholderFiles.length === 0) {
                        await createFolderPlaceholder(bucket, sourceParentFolder);
                    }
                }

                return data;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["storage", "files", variables.bucket] });
            toast.success("Moved successfully");
        },
        onError: (error: any) => {
            toast.error(`Failed to move: ${error.message}`);
        }
    });

    return {
        createBucket,
        deleteBucket,
        uploadFile,
        deleteFile,
        getPublicUrl,
        moveFile
    };
}
