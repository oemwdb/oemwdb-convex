/**
 * Custom Card Layout Component
 *
 * Description: A reusable card component with image, title, description, and action buttons
 *
 * Usage:
 * <CustomCardLayout
 *   image="/path/to/image.jpg"
 *   title="Card Title"
 *   description="Card description text"
 *   primaryAction="Learn More"
 *   secondaryAction="Share"
 * />
 *
 * Props:
 * - image: string (required) - URL to card image
 * - title: string (required) - Card title text
 * - description: string (optional) - Card description
 * - primaryAction: string (optional) - Primary button label
 * - secondaryAction: string (optional) - Secondary button label
 * - onPrimaryClick: () => void (optional) - Primary button handler
 * - onSecondaryClick: () => void (optional) - Secondary button handler
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomCardLayoutProps {
  image?: string;
  title: string;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const CustomCardLayout = ({
  image = "https://placehold.co/400x200",
  title,
  description,
  primaryAction = "Action",
  secondaryAction,
  onPrimaryClick,
  onSecondaryClick
}: CustomCardLayoutProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <div className="flex gap-2">
          <Button onClick={onPrimaryClick} className="flex-1">
            {primaryAction}
          </Button>
          {secondaryAction && (
            <Button onClick={onSecondaryClick} variant="outline" className="flex-1">
              {secondaryAction}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCardLayout;
