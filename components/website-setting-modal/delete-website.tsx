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
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteWebsiteProps {
  websiteId: string;
  websiteName: string;
  onDeleted?: () => void;
}

function DeleteWebsite({ websiteId, websiteName, onDeleted }: DeleteWebsiteProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setDeleting(true);
      await deleteSite(websiteId);
      toast.success("Website deleted successfully");
      setIsDialogOpen(false);
      onDeleted?.();
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Failed to delete website");
      return { success: false, error: error.message };
    } finally {
      setDeleting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
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
            disabled={deleting}
          />
        </div>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            disabled={deleteConfirmation.toLowerCase() !== "delete" || deleting}
            onClick={deleteAction}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 ">
            {deleting ? (
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
