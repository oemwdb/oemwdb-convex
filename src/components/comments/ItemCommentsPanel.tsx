import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquareMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemComments, type CommentableItemType } from "@/hooks/useItemComments";
import type { Id } from "../../../convex/_generated/dataModel";

interface ItemCommentsPanelProps {
  itemType: CommentableItemType;
  itemId: Id<"oem_brands"> | Id<"oem_vehicles"> | Id<"oem_wheels"> | Id<"oem_engines"> | null | undefined;
  itemName: string;
  layout?: "default" | "bottom-anchored";
  footerSlot?: ReactNode;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) {
    return "U";
  }
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

export default function ItemCommentsPanel({
  itemType,
  itemId,
  itemName: _itemName,
  layout = "default",
  footerSlot,
}: ItemCommentsPanelProps) {
  const navigate = useNavigate();
  const { comments, addComment, isLoading, isAuthenticated, isAvailable, error } = useItemComments(itemType, itemId);
  const [draft, setDraft] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await addComment(trimmed);
      setDraft("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const composer = (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          className="w-full min-h-24 resize-none rounded-lg border bg-background px-2 py-2 pb-10 pr-16 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={
            !isAvailable
              ? "Comments unavailable on this backend"
              : isAuthenticated
                ? "Write a comment..."
                : "Sign in to comment"
          }
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!isAuthenticated || isSubmitting || !isAvailable}
        />
        {isAuthenticated && isAvailable ? (
          <Button
            size="sm"
            className="absolute bottom-2 right-2 h-6 rounded-full px-2 text-[10px] leading-none"
            onClick={handleSubmit}
            disabled={!draft.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Posting
              </>
            ) : (
              "Post"
            )}
          </Button>
        ) : null}
      </div>
      {!isAvailable ? (
        <p className="text-xs text-muted-foreground">
          This backend does not expose engine comments yet.
        </p>
      ) : !isAuthenticated ? (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Sign in to comment
          </Button>
        </div>
      ) : null}
      {submitError ? (
        <p className="text-xs text-destructive">{submitError}</p>
      ) : null}
      {!submitError && error && isAvailable ? (
        <p className="text-xs text-destructive">
          {error.message || "Failed to load comments"}
        </p>
      ) : null}
    </div>
  );

  const commentsList = (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border bg-card p-2">
            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {getInitials(comment.userName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{comment.userName}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {comment.createdAt
                      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                      : "just now"}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {comment.commentText}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/20 p-2 text-center">
          <MessageSquareMore className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium">No comments yet</p>
          <p className="mt-2 text-xs text-muted-foreground">Be the first to comment.</p>
        </div>
      )}
    </div>
  );

  if (layout === "bottom-anchored") {
    return (
      <div className="-m-1 flex min-h-[420px] flex-1 flex-col">
        <div className="flex-1">{commentsList}</div>
        <div className="mt-6 space-y-4">
          {composer}
          {footerSlot}
        </div>
      </div>
    );
  }

  return (
    <div className="-m-1 space-y-2">
      {composer}
      {commentsList}
    </div>
  );
}
