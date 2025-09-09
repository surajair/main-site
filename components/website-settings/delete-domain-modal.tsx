"use client";

import { deleteDomain } from "@/actions/delete-domain-action";
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
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDomainModalProps {
  websiteId: string;
  domain: string;
}

function DeleteDomainModal({ websiteId, domain }: DeleteDomainModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteDomain = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDomain(domain, websiteId);

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });
        toast.success("Domain deleted successfully!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to delete domain");
      }
    } catch (error) {
      toast.error("Failed to delete domain");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={isDeleting ? undefined : setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Domain</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove &lsquo;{domain}&rsquo; from this website? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              handleDeleteDomain();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-600 hover:bg-red-700 text-white">
            {isDeleting ? (
              <>
                <Loader className="h-3 w-3 animate-spin mr-2" />
                Deleting
              </>
            ) : (
              "Remove Domain"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteDomainModal.displayName = "DeleteDomainModal";

export default DeleteDomainModal;
