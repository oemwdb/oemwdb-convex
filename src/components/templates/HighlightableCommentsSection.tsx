import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HighlightableField {
  id: string;
  value: string;
  label: string;
}

interface HighlightableCommentsSectionProps {
  fields: HighlightableField[];
  hoveredMapping: string | null;
  onElementClick: (elementId: string) => void;
  onElementHover: (elementId: string | null) => void;
}

const HighlightableCommentsSection: React.FC<HighlightableCommentsSectionProps> = ({
  fields,
  hoveredMapping,
  onElementClick,
  onElementHover,
}) => {
  const getFieldValue = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.value || `[${fieldId.toUpperCase()}]`;
  };

  const renderField = (fieldId: string, defaultValue: string, className?: string) => {
    const isHighlighted = hoveredMapping === fieldId;
    
    return (
      <span
        className={cn(
          "cursor-pointer transition-all duration-200 px-1 rounded",
          isHighlighted && "bg-yellow-200 dark:bg-yellow-900/50",
          className
        )}
        onClick={() => onElementClick(fieldId)}
        onMouseEnter={() => onElementHover(fieldId)}
        onMouseLeave={() => onElementHover(null)}
      >
        {getFieldValue(fieldId) || defaultValue}
      </span>
    );
  };

  // Mock comments for demonstration
  const mockComments = [
    { id: 1, user: "User1", date: "2024-01-15" },
    { id: 2, user: "User2", date: "2024-01-14" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      <p className="text-muted-foreground">
        {renderField("commentsDescription", "Join the discussion")}
      </p>
      
      <Card>
        <CardContent className="p-4">
          <textarea 
            className="w-full border rounded-md p-3 min-h-[100px]" 
            placeholder={getFieldValue("commentPlaceholder") || "Add your comment..."}
          />
          <div className="mt-2 flex justify-end">
            <Button>{renderField("postButtonText", "Post Comment")}</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {mockComments.map((comment, index) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {renderField(`commentAvatar${index}`, comment.user.charAt(0))}
                  </div>
                  <span className="font-medium">
                    {renderField(`commentUser${index}`, comment.user)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {renderField(`commentDate${index}`, comment.date)}
                </span>
              </div>
              <p className="mt-2">
                {renderField(`commentText${index}`, "[COMMENT TEXT]")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HighlightableCommentsSection;