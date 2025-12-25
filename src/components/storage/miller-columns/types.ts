
import { StorageFile } from "@/hooks/useStorage";

export interface ColumnItem extends StorageFile {
    kind: "file" | "folder";
}

export interface MillerColumn {
    id: string; // usually the folder name or 'root'
    path: string; // full path to this directory
    items: ColumnItem[];
}
