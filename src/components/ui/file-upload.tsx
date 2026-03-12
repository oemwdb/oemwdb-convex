import { useState, useRef, useCallback } from "react";
import { Upload, X, File, FileImage, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  uploadedFiles: string[];
  onRemove: (index: number) => void;
  label?: string;
  className?: string;
  showRemove?: boolean;
}

export function FileUpload({
  accept = "image/*",
  maxSize = 10,
  maxFiles = 10,
  onUpload,
  uploadedFiles,
  onRemove,
  label = "Upload files",
  className,
  showRemove = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSize * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSize}MB limit`,
          variant: "destructive"
        });
        continue;
      }

      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive"
        });
        break;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      setUploading(true);
      try {
        await onUpload(validFiles);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  }, [onUpload, uploadedFiles.length, maxFiles, maxSize]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      setUploading(true);
      try {
        await onUpload(validFiles);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onUpload, uploadedFiles.length, maxFiles, maxSize]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (url: string): 'image' | 'document' => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'];
    const ext = url.split('.').pop()?.toLowerCase() || '';
    return imageExtensions.includes(ext) ? 'image' : 'document';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all",
          "hover:border-primary/50 hover:bg-accent/5",
          isDragging && "border-primary bg-accent/10",
          uploading && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  Max {maxSize}MB per file • {maxFiles} files max
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {uploadedFiles.map((url, index) => {
            const fileType = getFileType(url);
            const fileName = url.split('/').pop() || 'file';

            return (
              <div
                key={index}
                className="relative group rounded-lg border bg-card overflow-hidden"
              >
                {fileType === 'image' ? (
                  <div className="aspect-video w-full">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full flex flex-col items-center justify-center gap-2 p-4">
                    <File className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-center text-muted-foreground truncate w-full">
                      {fileName}
                    </p>
                  </div>
                )}

                {showRemove ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
