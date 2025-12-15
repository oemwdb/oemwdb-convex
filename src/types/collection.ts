export type CollectionType = 'brands' | 'vehicles' | 'wheels';

export interface SearchableField {
  key: string;
  label: string;
  searchable: boolean;
}

export interface FilterableField {
  key: string;
  label: string;
  type: 'dropdown' | 'boolean' | 'daterange';
  options?: string[];
}

export interface CollectionConfig {
  searchableFields: SearchableField[];
  filterableFields: FilterableField[];
  tableName: string;
}

export const COLLECTION_CONFIGS: Record<CollectionType, CollectionConfig> = {
  brands: {
    searchableFields: [
      { key: 'name', label: 'Brand Name', searchable: true },
      { key: 'brand_description', label: 'Description', searchable: true },
      { key: 'brand_page', label: 'Brand Page', searchable: true },
    ],
    filterableFields: [
      { key: 'hasWheels', label: 'Has Wheels', type: 'boolean' },
      { key: 'hasImage', label: 'Has Image', type: 'boolean' },
    ],
    tableName: 'oem_brands',
  },
  vehicles: {
    searchableFields: [
      { key: 'chassis_code', label: 'Chassis Code', searchable: true },
      { key: 'model_name', label: 'Model Name', searchable: true },
      { key: 'vehicle_title', label: 'Vehicle Title', searchable: true },
    ],
    filterableFields: [
      { key: 'hasWheels', label: 'Has Wheels', type: 'boolean' },
    ],
    tableName: 'oem_vehicles',
  },
  wheels: {
    searchableFields: [
      { key: 'wheel_name', label: 'Wheel Name', searchable: true },
      { key: 'part_numbers', label: 'Part Numbers', searchable: true },
      { key: 'color', label: 'Color', searchable: true },
    ],
    filterableFields: [
      { 
        key: 'Status', 
        label: 'Status', 
        type: 'dropdown',
        options: ['Ready for website', 'Needs Good Pic']
      },
      { 
        key: 'Brand', 
        label: 'Brand', 
        type: 'dropdown',
        options: [] // Will be populated from data
      },
      { 
        key: 'Diameter', 
        label: 'Diameter', 
        type: 'dropdown',
        options: [] // Will be populated from data
      },
      { 
        key: 'BoltPattern', 
        label: 'Bolt Pattern', 
        type: 'dropdown',
        options: [] // Will be populated from data
      },
    ],
    tableName: 'oem_wheels',
  },
};