
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      <p className="text-slate-500">Join the discussion about {vehicleName}</p>
      
      <Card>
        <CardContent className="p-4">
          <textarea 
            className="w-full border border-slate-300 rounded-md p-3 min-h-[100px]" 
            placeholder="Add your comment..."
          />
          <div className="mt-2 flex justify-end">
            <Button>Post Comment</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    {comment.user.charAt(0)}
                  </div>
                  <span className="font-medium">{comment.user}</span>
                </div>
                <span className="text-xs text-slate-500">{comment.date}</span>
              </div>
              <p className="mt-2">{comment.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
