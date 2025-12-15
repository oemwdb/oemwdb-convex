export type ViewType = 'table' | 'board' | 'calendar' | 'gallery' | 'list';

export type CellType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'date' 
  | 'datetime' 
  | 'checkbox' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'file' 
  | 'image' 
  | 'relation' 
  | 'rollup' 
  | 'formula' 
  | 'progress' 
  | 'rating'
  | 'richtext'
  | 'json'
  | 'tags';

export interface TableColumn {
  id: string;
  key: string;
  label: string;
  type: CellType;
  width?: number;
  editable?: boolean;
  required?: boolean;
  options?: SelectOption[];
  relationTable?: string;
  relationKey?: string;
  formula?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  format?: string;
  validation?: ValidationRule;
}

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

export interface ValidationRule {
  type: 'regex' | 'range' | 'length' | 'custom';
  pattern?: string;
  min?: number;
  max?: number;
  message?: string;
  validator?: (value: any) => boolean;
}

export interface Filter {
  id: string;
  column: string;
  operator: FilterOperator;
  value: any;
  conjunction?: 'and' | 'or';
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with' 
  | 'ends_with' 
  | 'is_empty' 
  | 'is_not_empty'
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in';

export interface Sort {
  column: string;
  direction: 'asc' | 'desc';
  priority?: number;
}

export interface GroupBy {
  column: string;
  collapsed?: string[];
  sortDirection?: 'asc' | 'desc';
}

export interface View {
  id: string;
  name: string;
  type: ViewType;
  filters: Filter[];
  sorts: Sort[];
  groupBy?: GroupBy;
  hiddenColumns?: string[];
  columnOrder?: string[];
  columnWidths?: Record<string, number>;
  isDefault?: boolean;
  isShared?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: any;
  action: (rows: any[]) => Promise<void>;
  confirmMessage?: string;
  variant?: 'default' | 'destructive';
}

export interface DatabaseState {
  activeView: View;
  selectedRows: Set<string>;
  editingCell: { rowId: string; columnId: string } | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export interface ReferenceFieldConfig {
  table: string;
  valueColumn: string;
  labelColumn: string;
}

export type ReferenceFieldKey = 
  | 'brand_ref'
  | 'bolt_pattern_ref'
  | 'center_bore_ref'
  | 'color_ref'
  | 'diameter_ref'
  | 'width_ref'
  | 'tire_size_ref'
  | 'vehicle_ref'
  | 'wheel_ref';

export const REFERENCE_FIELD_CONFIG: Record<ReferenceFieldKey, ReferenceFieldConfig> = {
  brand_ref: { table: 'oem_brands', valueColumn: 'brand_title', labelColumn: 'brand_title' },
  bolt_pattern_ref: { table: 'oem_bolt_patterns', valueColumn: 'bolt_pattern', labelColumn: 'bolt_pattern' },
  center_bore_ref: { table: 'oem_center_bores', valueColumn: 'center_bore', labelColumn: 'center_bore' },
  color_ref: { table: 'oem_colors', valueColumn: 'color', labelColumn: 'color' },
  diameter_ref: { table: 'oem_diameters', valueColumn: 'diameter', labelColumn: 'diameter' },
  width_ref: { table: 'oem_widths', valueColumn: 'width', labelColumn: 'width' },
  tire_size_ref: { table: 'tire_sizes', valueColumn: 'tire_size', labelColumn: 'tire_size' },
  vehicle_ref: { table: 'oem_vehicles', valueColumn: 'vehicle_title', labelColumn: 'vehicle_title' },
  wheel_ref: { table: 'oem_wheels', valueColumn: 'wheel_title', labelColumn: 'wheel_title' }
};
