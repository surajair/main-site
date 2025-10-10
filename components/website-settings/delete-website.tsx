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
import { useTranslation } from "chai-next";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function DeleteWebsite({ websiteId, websiteName }: { websiteId: string; websiteName: string }) {
  const { t } = useTranslation();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteWebsite = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSite(websiteId);
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["websites-list"] });
        setIsDialogOpen(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(t("An unexpected error occurred. Please try again."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    // Prevent closing dialog while deleting
    if (isDeleting) return;

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
          {t("Delete")} <span className="opacity-85 font-light">{websiteName}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Delete")} &quot;{websiteName}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {t("This action cannot be undone. This will permanently delete your website and remove all data from our servers.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 mt-4">
          <Label htmlFor="delete-confirm">{t("Type 'DELETE' to confirm")}</Label>
          <Input
            id="delete-confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder={t("DELETE")}
            disabled={isDeleting}
          />
        </div>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel disabled={isDeleting}>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteWebsite();
            }}
            disabled={deleteConfirmation.toLowerCase() !== "delete" || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 ">
            {isDeleting ? (
              <>
                <Loader className="h-3 w-3 animate-spin mr-2" />
                {t("Deleting")}
              </>
            ) : (
              t("Delete Website")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteWebsite.displayName = "DeleteWebsite";

export default DeleteWebsite;
