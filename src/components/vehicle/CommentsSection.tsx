import React from "react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: number;
  user: string;
  comment: string;
  date: string;
}

interface CommentsSectionProps {
  vehicleName: string;
  comments: Comment[];
}

const CommentsSection = ({ vehicleName, comments }: CommentsSectionProps) => {
  return (
    <div className="space-y-6 pt-2">
      {/* Input */}
      <div className="relative group">
        <textarea
          className="w-full text-xs bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-lg p-3 min-h-[80px] border-none focus:outline-none focus:ring-0 resize-none placeholder:text-muted-foreground/50 text-foreground"
          placeholder="Write a comment..."
        />
        <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="h-6 text-xs font-normal hover:bg-secondary px-3">Post</Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment.id} className="group">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-[10px] font-medium text-muted-foreground">
                {comment.user.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-foreground/90">{comment.user}</span>
                  <span className="text-[10px] text-muted-foreground/60">{comment.date}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
