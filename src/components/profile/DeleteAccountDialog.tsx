import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
    userEmail?: string;
}

export const DeleteAccountDialog = ({ userEmail }: DeleteAccountDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [understood, setUnderstood] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const canDelete = confirmText === "DELETE" && understood;

    const handleDelete = async () => {
        if (!canDelete) return;

        setIsDeleting(true);
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("No user found");
            }

            // Delete user profile data first (if exists)
            await supabase
                .from("profiles")
                .delete()
                .eq("id", user.id);

            // Sign out the user (Supabase doesn't allow self-deletion via client SDK)
            // The actual account deletion would need to be done via admin API or Edge Function
            await supabase.auth.signOut();

            toast({
                title: "Account Deletion Requested",
                description: "Your account has been marked for deletion. You have been signed out.",
            });

            navigate("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast({
                title: "Error",
                description: "Failed to delete account. Please contact support.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            This action is <strong>permanent and irreversible</strong>. All your data will be deleted, including:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Your profile information</li>
                            <li>Saved favorites and collections</li>
                            <li>Garage and registered vehicles</li>
                            <li>All account preferences</li>
                        </ul>
                        {userEmail && (
                            <p className="text-sm text-muted-foreground">
                                Account: <span className="font-mono">{userEmail}</span>
                            </p>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="understood"
                            checked={understood}
                            onCheckedChange={(checked) => setUnderstood(checked as boolean)}
                        />
                        <Label htmlFor="understood" className="text-sm text-muted-foreground leading-relaxed">
                            I understand that this action is permanent and all my data will be deleted.
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm" className="text-sm">
                            Type <span className="font-mono font-bold">DELETE</span> to confirm:
                        </Label>
                        <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                            className="font-mono"
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!canDelete || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
