"use client";

import { deleteSite } from "@/actions/delete-site-action";
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
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

function DeleteWebsite({ websiteId, websiteName }: { websiteId: string; websiteName: string }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const [, deleteAction, deleting] = useActionState(async () => {
    try {
      setIsDeleting(true);
      await deleteSite(websiteId);
      queryClient.invalidateQueries({ queryKey: ["websites-list"] });
      setIsDialogOpen(false);
      toast.success("Website deleted successfully");
      return { success: true };
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete website");
      setIsDeleting(false);
      return { success: false, error: error.message };
    }
  }, null);

  const handleDialogClose = (open: boolean) => {
    // Prevent closing dialog while deleting
    if (deleting) return;

    setIsDialogOpen(open);
    if (!open) {
      setDeleteConfirmation("");
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => e.stopPropagation()}
          className="w-full justify-start text-destructive hover:opacity-90">
          <Trash2 className="h-3.5 w-3.5" />
          Delete <span className="opacity-85 font-light">{websiteName}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{websiteName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your website and remove all data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 mt-4">
          <Label htmlFor="delete-confirm">Type &apos;DELETE&apos; to confirm</Label>
          <Input
            id="delete-confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="DELETE"
            disabled={isDeleting}
          />
        </div>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              deleteAction();
            }}
            disabled={deleteConfirmation.toLowerCase() !== "delete" || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 ">
            {isDeleting ? (
              <>
                <Loader className="h-3 w-3 animate-spin" />
                Deleting
              </>
            ) : (
              "Delete Website"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteWebsite.displayName = "DeleteWebsite";

export default DeleteWebsite;
