/**
 * Workshop Components Index
 *
 * This file exports all custom workshop components.
 * Each component is fully documented with usage examples and prop types.
 *
 * Components:
 * - CustomCardLayout: Card with image, title, and actions
 * - StatsWidget: Statistics display with icon and trend
 * - DataTableRow: Customizable table row with actions
 *
 * To add a new component:
 * 1. Create a new .tsx file in this directory
 * 2. Add full JSDoc documentation at the top
 * 3. Export it here
 * 4. Add it to the workshop page component selector
 */

export { CustomCardLayout } from './CustomCardLayout';
export { StatsWidget } from './StatsWidget';
export { DataTableRow } from './DataTableRow';

// Component metadata for the workshop
export const workshopComponents = [
  {
    id: 'custom-card-layout',
    name: 'Custom Card Layout',
    description: 'A reusable card component with image, title, description, and action buttons',
    category: 'Custom Components',
    file: 'CustomCardLayout.tsx'
  },
  {
    id: 'stats-widget',
    name: 'Stats Widget',
    description: 'A statistics card displaying an icon, metric value, label, and trend indicator',
    category: 'Custom Components',
    file: 'StatsWidget.tsx'
  },
  {
    id: 'data-table-row',
    name: 'Data Table Row',
    description: 'A customizable table row with avatar, data fields, and action buttons',
    category: 'Custom Components',
    file: 'DataTableRow.tsx'
  }
];
