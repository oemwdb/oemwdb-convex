
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Loader2, MessageSquare, Tag } from "lucide-react";
import { useVehicleComments, TAG_OPTIONS } from "@/hooks/useVehicleComments";
import { formatDistanceToNow } from "date-fns";

interface DiscussionSectionProps {
    vehicleId: string;
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({ vehicleId }) => {
    const { comments, isLoading, error, addComment, TAG_OPTIONS: tags } = useVehicleComments(vehicleId);
    const [newComment, setNewComment] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredComments = activeFilter === "All"
        ? comments
        : comments?.filter(c => c.tag === activeFilter);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        // Default to "General" if viewing "All", otherwise use active filter
        const tagToApply = activeFilter === "All" ? "General" : activeFilter;

        try {
            await addComment.mutateAsync({
                comment: newComment,
                tag: tagToApply
            });
            setNewComment("");
            // Keep the filter active so user sees their new post
        } catch (err) {
            console.error("Failed to post comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBadgeColor = (tag: string, isActive: boolean = false) => {
        const baseStyle = isActive ? "ring-2 ring-primary ring-offset-2" : "opacity-80 hover:opacity-100";

        switch (tag) {
            case "Maintenance": return `bg-red-100 text-red-800 hover:bg-red-200 ${baseStyle}`;
            case "Upgrades": return `bg-blue-100 text-blue-800 hover:bg-blue-200 ${baseStyle}`;
            case "Wheels": return `bg-purple-100 text-purple-800 hover:bg-purple-200 ${baseStyle}`;
            case "Brief": return `bg-gray-100 text-gray-800 hover:bg-gray-200 ${baseStyle}`;
            case "Variants": return `bg-orange-100 text-orange-800 hover:bg-orange-200 ${baseStyle}`;
            case "All": return `bg-slate-800 text-white hover:bg-slate-900 ${baseStyle}`;
            default: return `bg-slate-100 text-slate-800 hover:bg-slate-200 ${baseStyle}`;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-destructive text-center py-4">
                Failed to load discussion.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tags */}
            <div className="flex gap-2 flex-wrap pt-2">
                <Badge
                    variant={activeFilter === "All" ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 transition-all ${activeFilter === "All" ? "" : "hover:bg-slate-100"}`}
                    onClick={() => setActiveFilter("All")}
                >
                    All
                </Badge>
                {tags.map(tag => (
                    <Badge
                        key={tag}
                        className={`cursor-pointer px-3 py-1 transition-all ${getBadgeColor(tag, activeFilter === tag)}`}
                        onClick={() => setActiveFilter(tag)}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {filteredComments && filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                        <Card key={comment.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">
                                            U
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">User</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={getBadgeColor(comment.tag)}>
                                        {comment.tag}
                                    </Badge>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap pl-10">
                                    {comment.comment_text}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No comments found for {activeFilter}. Be the first to start the discussion!
                    </div>
                )}
            </div>

            {/* Input Area */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <textarea
                                className="w-full border border-input bg-transparent rounded-md p-3 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                placeholder={`Share your thoughts on ${activeFilter === "All" ? "General" : activeFilter}...`}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Posting to: <span className="font-medium text-foreground">{activeFilter === "All" ? "General" : activeFilter}</span>
                            </span>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={!newComment.trim() || isSubmitting}
                            size="sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post Comment"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DiscussionSection;
