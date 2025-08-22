"use client";

import { deleteSite } from "@/actions/delete-site-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Site } from "@/utils/types";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ConfirmDialog } from "./confirm-dialog";
import Loader from "./loader";
import { SiteDetailsModal } from "./site-detail-modal";

interface SiteModalsProps {
  site: Site;
  showDetailsModal: boolean;
  setShowDetailsModal: (open: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (open: boolean) => void;
  isDeleting?: boolean;
}

export const SiteMenu = ({
  site,
  isDeleting,
  setShowDetailsModal,
  setShowDeleteConfirm,
}: SiteModalsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-8 hover:bg-gray-100"
        >
          {isDeleting ? (
            <Loader fullscreen={false} />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white cursor-pointer">
        <DropdownMenuItem
          onClick={() => setShowDetailsModal(true)}
          className="cursor-pointer hover:bg-gray-100"
        >
          Site Details
        </DropdownMenuItem>
        {site?.apiKey?.length > 0 && (
          <DropdownMenuItem
            onClick={() => setShowDetailsModal(true)}
            className="cursor-pointer hover:bg-gray-100"
          >
            API Key
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="border-t" />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="text-red-600 cursor-pointer hover:bg-gray-100"
        >
          Delete Site
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SiteModalsProps {
  site: Site;
  showDetailsModal: boolean;
  setShowDetailsModal: (open: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (open: boolean) => void;
}

export const SiteModals = ({
  site,
  showDetailsModal,
  setShowDetailsModal,
  showDeleteConfirm,
  setShowDeleteConfirm,
}: SiteModalsProps) => {
  const handleDelete = async () => {
    try {
      toast.promise(deleteSite(site.id), {
        loading: "Deleting website...",
        success: () => "Website deleted successfully",
        error: () => "Failed to delete website",
        position: "top-center",
      });
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error("Failed to delete website.");
    }
  };

  return (
    <>
      {showDetailsModal && (
        <SiteDetailsModal site={site} onOpenChange={setShowDetailsModal} />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          onOpenChange={setShowDeleteConfirm}
          title="Delete Site"
          description={`Are you sure you want to delete "${site.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          projectName={site.name}
          requireProjectName={true}
        />
      )}
    </>
  );
};
