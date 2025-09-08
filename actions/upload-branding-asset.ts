"use server";

import { getSupabaseAdmin } from "chai-next/server";

export type UploadBrandingAssetPayload = {
  websiteId: string;
  file: File;
  type: "favicon" | "logo";
};

export type RemoveBrandingAssetPayload = {
  websiteId: string;
  type: "favicon" | "logo";
  currentUrl?: string;
};

export async function removeBrandingAsset({ websiteId, type, currentUrl }: RemoveBrandingAssetPayload) {
  if (!websiteId || !type) {
    return { success: false, error: "Missing required parameters" } as const;
  }

  try {
    const supabase = await getSupabaseAdmin();

    // Try to determine file path from current URL or construct it
    let filePath = "";
    if (currentUrl && currentUrl.includes(`${websiteId}/`)) {
      // Extract path from Supabase URL
      const urlParts = currentUrl.split(`${websiteId}/`);
      if (urlParts.length > 1) {
        filePath = `${websiteId}/${urlParts[1].split("?")[0]}`;
      }
    }

    // If we couldn't extract path, try common extensions
    if (!filePath) {
      const extensions = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"];
      for (const ext of extensions) {
        const testPath = `${websiteId}/${type}.${ext}`;
        const { data } = await supabase.storage.from("branding").list(websiteId);
        if (data?.some(file => file.name === `${type}.${ext}`)) {
          filePath = testPath;
          break;
        }
      }
    }

    // Try to remove from Supabase storage if we have a path
    if (filePath) {
      const { error: removeError } = await supabase.storage
        .from("branding")
        .remove([filePath]);
      
      // Don't throw error if removal fails - we'll still clear the URL
      if (removeError) {
        console.warn(`Failed to remove ${filePath} from storage:`, removeError);
      }
    }

    return {
      success: true,
      removed: !!filePath,
    } as const;

  } catch (error: any) {
    // Even if Supabase removal fails, we consider it a success for URL clearing
    return {
      success: true,
      removed: false,
      error: error?.message || "Failed to remove from storage, but URL will be cleared",
    } as const;
  }
}

export async function uploadBrandingAsset({ websiteId, file, type }: UploadBrandingAssetPayload) {
  if (!websiteId || !file || !type) {
    return { success: false, error: "Missing required parameters" } as const;
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (type === "favicon") {
    allowedTypes.push("image/x-icon", "image/vnd.microsoft.icon");
  }

  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type. Please upload an image file." } as const;
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { success: false, error: "File size too large. Maximum size is 5MB." } as const;
  }

  try {
    const supabase = await getSupabaseAdmin();

    // Generate file path
    const fileExtension = file.name.split(".").pop() || "png";
    const fileName = `${type}.${fileExtension}`;
    const filePath = `${websiteId}/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("branding") // You may need to create this bucket in Supabase
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: true, // Replace existing file
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("branding").getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    } as const;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to upload file",
    } as const;
  }
}
