/**
 * Data Table Row Component
 *
 * Description: A customizable table row with avatar, data fields, and action buttons
 *
 * Usage:
 * <DataTableRow
 *   avatar={{ src: "/avatar.jpg", fallback: "JD" }}
 *   fields={[
 *     { label: "Name", value: "John Doe" },
 *     { label: "Email", value: "john@example.com" },
 *     { label: "Role", value: "Admin" }
 *   ]}
 *   actions={[
 *     { label: "Edit", onClick: () => {} },
 *     { label: "Delete", onClick: () => {}, variant: "destructive" }
 *   ]}
 * />
 *
 * Props:
 * - avatar: { src?: string, fallback: string } (optional) - Avatar configuration
 * - fields: Array<{ label: string, value: string }> (required) - Data fields to display
 * - actions: Array<{ label: string, onClick: () => void, variant?: string }> (optional) - Action buttons
 * - selected: boolean (optional) - Whether row is selected
 * - onSelect: (selected: boolean) => void (optional) - Selection handler
 */

import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface DataTableRowProps {
  avatar?: {
    src?: string;
    fallback: string;
  };
  fields: Array<{
    label: string;
    value: string | React.ReactNode;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  }>;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export const DataTableRow = ({
  avatar,
  fields,
  actions = [],
  selected = false,
  onSelect
}: DataTableRowProps) => {
  return (
    <TableRow>
      {onSelect && (
        <TableCell className="w-12">
          <Checkbox checked={selected} onCheckedChange={onSelect} />
        </TableCell>
      )}
      {avatar && (
        <TableCell>
          <Avatar>
            {avatar.src && <AvatarImage src={avatar.src} />}
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        </TableCell>
      )}
      {fields.map((field, index) => (
        <TableCell key={index}>
          {typeof field.value === 'string' ? (
            <div>
              <div className="font-medium">{field.value}</div>
              {field.label && (
                <div className="text-sm text-muted-foreground">{field.label}</div>
              )}
            </div>
          ) : (
            field.value
          )}
        </TableCell>
      ))}
      {actions.length > 0 && (
        <TableCell className="text-right">
          {actions.length <= 2 ? (
            <div className="flex gap-2 justify-end">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

export default DataTableRow;
