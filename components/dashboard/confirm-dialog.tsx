"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Loader from "./loader";

interface ConfirmDialogProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  projectName?: string;
  requireProjectName?: boolean;
}

export function ConfirmDialog({
  onOpenChange,
  title,
  description,
  onConfirm,
  projectName,
  requireProjectName,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onClickConfirm = async () => {
    setLoading(true);
    await onConfirm?.();
    setLoading(false);
  };

  const handleStateChange = (newState: boolean) => {
    if (!loading) onOpenChange(newState);
  };

  return (
    <Dialog open={true} onOpenChange={handleStateChange}>
      <DialogContent className={`z-[999]`}>
        {loading && <Loader />}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {requireProjectName && (
          <div className="mb-4 flex flex-col gap-2">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700"
            >
              Type &quot;<strong>{projectName}</strong>&quot; to confirm
            </label>
            <Input
              id="projectName"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button onClick={(e) => handleStateChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={onClickConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={requireProjectName && inputValue !== projectName}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
