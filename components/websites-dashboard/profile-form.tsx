"use client";

import { updateUserProfile } from "@/actions/update-profile-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileFormProps {
  initialName: string;
}

export function ProfileForm({ initialName }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setHasChanges(value !== initialName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !hasChanges) return;

    setIsUpdating(true);
    try {
      await updateUserProfile(fullName.trim());
      toast.success("Profile updated successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={handleNameChange}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating || fullName === initialName} className="px-6">
          {isUpdating ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Name"
          )}
        </Button>
      </div>
    </form>
  );
}
