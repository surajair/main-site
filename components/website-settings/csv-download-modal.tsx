"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isEmpty } from "lodash";
import { Calendar, Download, Loader, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CsvDownloadModalProps {
  websiteId: string;
  searchTerm?: string;
  totalSubmissions?: number;
}

export default function CsvDownloadModal({ websiteId, searchTerm = "", totalSubmissions = 0 }: CsvDownloadModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle CSV download with optional date range
  const handleDownloadCSV = async (startDateParam?: string, endDateParam?: string) => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      // Build query parameters using Lodash
      const params = new URLSearchParams();

      if (!isEmpty(searchTerm)) {
        params.set("search", searchTerm);
      }

      if (!isEmpty(startDateParam)) {
        params.set("startDate", startDateParam!);
      }

      if (!isEmpty(endDateParam)) {
        params.set("endDate", endDateParam!);
      }

      const queryString = params.toString();
      const url = `/api/forms/${websiteId}/export${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download CSV");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;

      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "form-submissions.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast.success("CSV downloaded successfully!", {
        position: "bottom-right",
      });

      // Close modal after successful download
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download CSV", {
        position: "bottom-right",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle download all submissions
  const handleDownloadAll = async () => {
    await handleDownloadCSV();
  };

  // Handle download with date range
  const handleDateRangeDownload = async () => {
    if (isEmpty(startDate) && isEmpty(endDate)) {
      toast.error("Please select at least one date", {
        position: "bottom-right",
      });
      return;
    }

    if (!isEmpty(startDate) && !isEmpty(endDate) && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date", {
        position: "bottom-right",
      });
      return;
    }

    await handleDownloadCSV(startDate || undefined, endDate || undefined);
  };

  // Reset date range
  const resetDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  // Reset form when modal closes
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      resetDateRange();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={totalSubmissions === 0}>
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download Form Submissions</DialogTitle>
          <DialogDescription>Choose how you want to download your form submissions as CSV.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-3">
          {/* Date Range Option */}
          <div className="space-y-4">
            <div className="flex items-start justify-center  flex-col">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date Range
              </h4>
              <p className="text-sm text-muted-foreground">Choose specific start and end dates to filter submissions</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="w-fit"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="w-fit"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Date Range Preview */}
            {(!isEmpty(startDate) || !isEmpty(endDate)) && (
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <span>
                  {!isEmpty(startDate) && !isEmpty(endDate)
                    ? `From ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
                    : !isEmpty(startDate)
                      ? `From ${new Date(startDate).toLocaleDateString()}`
                      : `Until ${new Date(endDate).toLocaleDateString()}`}
                </span>
                <Button variant="ghost" size="sm" onClick={resetDateRange} className="p-1 h-auto">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Date Range Download Button */}
            <Button
              onClick={handleDateRangeDownload}
              size={"sm"}
              disabled={isDownloading || (isEmpty(startDate) && isEmpty(endDate))}
              className="w-full">
              {isDownloading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download with Date Filter
                </>
              )}
            </Button>
          </div>

          {/* OR Separator */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground uppercase tracking-wide">OR</span>
            </div>
          </div>
          {/* Download All Option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-center items-start w-full gap-2">
                <p className="text-sm text-muted-foreground">Download all form submissions without any date filter</p>
                <Button onClick={handleDownloadAll} disabled={isDownloading} size="sm" className="w-full">
                  {isDownloading ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download All
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isDownloading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
