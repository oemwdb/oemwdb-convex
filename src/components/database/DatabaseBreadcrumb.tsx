import { ChevronRight, Database, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DatabaseBreadcrumbProps {
  currentTable: string;
  currentTableLabel: string;
  selectedRecordName?: string;
  tables: Array<{ name: string; label: string }>;
  onTableChange: (tableName: string) => void;
}

export function DatabaseBreadcrumb({
  currentTable,
  currentTableLabel,
  selectedRecordName,
  tables,
  onTableChange,
}: DatabaseBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Database className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">Database</span>
      
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 hover:bg-accent">
            <Table className="h-3.5 w-3.5" />
            <span className="font-medium">{currentTableLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {tables.map((table) => (
            <DropdownMenuItem
              key={table.name}
              onClick={() => onTableChange(table.name)}
              className={currentTable === table.name ? "bg-accent" : ""}
            >
              {table.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedRecordName && (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground truncate max-w-[200px]">{selectedRecordName}</span>
        </>
      )}
    </div>
  );
}
