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
import { Loader, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface DeleteDomainModalProps {
  websiteId: string;
  domain: string;
}

function DeleteDomainModal({ websiteId, domain }: DeleteDomainModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDomainState, deleteDomainAction, deleteDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const websiteId = formData.get("websiteId") as string;
      const domain = formData.get("domain") as string;

      if (!websiteId || !domain) {
        toast.error("Missing required information");
        return { success: false, error: "Missing required information" };
      }

      const result = await deleteDomain(domain, websiteId);

      if (result.success) {
        toast.success("Domain deleted successfully!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to delete domain");
      }

      return result;
    },
    { success: false, error: "" },
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={deleteDomainPending ? undefined : setIsOpen}>
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
          <AlertDialogCancel disabled={deleteDomainPending}>Cancel</AlertDialogCancel>
          <form action={deleteDomainAction} onClick={(e) => e.stopPropagation()}>
            <input type="hidden" name="websiteId" value={websiteId} />
            <input type="hidden" name="domain" value={domain} />
            <AlertDialogAction
              type="submit"
              disabled={deleteDomainPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-600 hover:bg-red-700 text-white">
              {deleteDomainPending ? (
                <>
                  <Loader className="h-3 w-3 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Remove Domain"
              )}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DeleteDomainModal.displayName = "DeleteDomainModal";

export default DeleteDomainModal;
