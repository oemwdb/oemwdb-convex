# Workshop Components

This directory contains custom reusable components created for the shadcn Workshop.

## Purpose

The Workshop serves as a design system reference and component library where you can:
- Browse and test all shadcn/ui components
- Create and document custom component variants
- Maintain a consistent design language across your app
- Quickly reference component APIs and usage patterns

## Structure

Each component file should follow this structure:

```tsx
/**
 * Component Name
 *
 * Description: Brief description of what the component does
 *
 * Usage:
 * <ComponentName
 *   prop1="value1"
 *   prop2="value2"
 * />
 *
 * Props:
 * - prop1: type (required/optional) - Description
 * - prop2: type (required/optional) - Description
 */

import { ... } from "@/components/ui/...";

interface ComponentNameProps {
  // Props interface
}

export const ComponentName = ({ ...props }: ComponentNameProps) => {
  return (
    // Component JSX
  );
};

export default ComponentName;
```

## Adding New Components

1. **Create the component file**
   ```bash
   touch src/components/workshop/YourComponent.tsx
   ```

2. **Add full documentation** at the top of the file (see structure above)

3. **Export in index.ts**
   ```typescript
   export { YourComponent } from './YourComponent';
   ```

4. **Add to workshopComponents metadata** in index.ts
   ```typescript
   {
     id: 'your-component',
     name: 'Your Component',
     description: 'What it does',
     category: 'Custom Components',
     file: 'YourComponent.tsx'
   }
   ```

5. **Add to ShadcnWorkshopPage.tsx**:
   - Import the component
   - Add to componentCategories array
   - Add preview case in renderComponentPreview()

## Current Components

### CustomCardLayout
A reusable card with image, title, description, and action buttons.
Perfect for product cards, feature highlights, or content previews.

### StatsWidget
Statistics display with icon, value, label, and trend indicator.
Use for dashboards, analytics, and metric displays.

### DataTableRow
Customizable table row with avatar, data fields, and action buttons.
Great for user lists, data tables, and admin interfaces.

## Design Principles

- **Composable**: Build complex UIs from simple, reusable pieces
- **Accessible**: Follow ARIA guidelines and keyboard navigation
- **Themeable**: Use CSS variables for colors and spacing
- **Documented**: Every component has usage examples and prop descriptions
- **Typed**: Full TypeScript support with proper interfaces

## Workflow

1. **Design** new components in the Workshop with the grid preview
2. **Document** usage examples and prop types
3. **Test** different variants and states
4. **Reference** when building features across the app
5. **Iterate** based on real usage patterns

## Best Practices

- Keep components focused on a single responsibility
- Use composition over configuration
- Provide sensible defaults
- Make props optional when possible
- Include examples in documentation
- Test edge cases and states

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
