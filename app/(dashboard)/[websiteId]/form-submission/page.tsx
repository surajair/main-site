"use client";

import { FormSubmission, getFormSubmissions, GetFormSubmissionsResponse } from "@/actions/get-form-submissions-action";
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
import { debounce } from "lodash";
import { BookOpenText, ChevronLeft, ChevronRight, FileText, Loader, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function humanizeKey(input: string): string {
  const s = String(input)
    .replace(/[_-]+/g, " ") // snake/kebab -> spaces
    .replace(/([a-z\d])([A-Z])/g, "$1 $2") // camelCase -> spaces
    .replace(/\s+/g, " ") // collapse spaces
    .trim();

  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case each word
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SubmissionsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [submissionsData, setSubmissionsData] = useState<GetFormSubmissionsResponse | null>(null);
  const itemsPerPage = 10;

  const debouncedSearchRef = useMemo(
    () =>
      debounce((searchValue: string) => {
        setDebouncedSearchTerm(searchValue);
        setCurrentPage(1);
      }, 300),
    [],
  );

  // Effect to handle search term changes
  useEffect(() => {
    debouncedSearchRef(searchTerm);
    return () => {
      debouncedSearchRef.cancel();
    };
  }, [searchTerm, debouncedSearchRef]);

  // Fetch submissions function
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFormSubmissions({
        websiteId,
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
      });
      setSubmissionsData(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissionsData(null);
    } finally {
      setIsLoading(false);
    }
  }, [websiteId, currentPage, itemsPerPage, debouncedSearchTerm]);

  // Effect to fetch submissions when dependencies change
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filter submissions based on search term
  const filteredSubmissions = submissionsData?.submissions || [];
  const totalPages = submissionsData?.totalPages || 0;
  const startIndex = submissionsData ? (submissionsData.currentPage - 1) * itemsPerPage : 0;

  return (
    <div className="flex- 1 space-y-4 h-full">
      <div className="space-y-1">
        <div className="font-semibold leading-none tracking-tight flex items-center gap-2">
          <BookOpenText className="w-5 h-5" /> Form submissions
        </div>
      </div>
      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total: {submissionsData?.total || 0}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 h-[calc(100vh-210px)]">
          <Loader className="animate-spin" />
          <div className="text-muted-foreground mt-2 text-xs">Loading submissions...</div>
        </div>
      ) : (
        <>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-310px)]">
            {filteredSubmissions.map((submission: FormSubmission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{submission.formData?.formName || "Unknown Form"}</p>
                    <p className="text-sm text-muted-foreground">{submission.formData.email || "No email provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground min-w-[80px]">{formatDate(submission.createdAt)}</span>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Form Submission</DialogTitle>
                        <DialogDescription>
                          Submitted by <span className="text-gray-700">{submission.formData.email || "Unknown"}</span>{" "}
                          on <span className="text-gray-700">{formatDate(submission.createdAt)}</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium">Form Data</h4>
                          <div className="bg-muted px-4 py-2 rounded-lg space-y-2 max-h-96 overflow-y-auto">
                            {Object.entries(submission.formData).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium capitalize">{humanizeKey(key)}</span>
                                <span className="text-muted-foreground max-w-md text-right">
                                  {String(value) || "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                          <h4 className="font-medium pt-2">Additional Data</h4>
                          <div className="bg-muted px-4 py-2 rounded-lg space-y-2 max-h-96 overflow-y-auto">
                            {Object.entries(submission.additionalData).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium capitalize">{humanizeKey(key)}</span>
                                <span className="text-muted-foreground max-w-md text-right">
                                  {String(value) || "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && filteredSubmissions.length === 0 && (
            <div className="text-center h-full w-full flex flex-col justify-center items-center ">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {debouncedSearchTerm ? "No submissions found matching your search." : "No submissions yet."}
              </p>
            </div>
          )}

          {!isLoading && filteredSubmissions.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, submissionsData?.total || 0)} of{" "}
                {submissionsData?.total || 0} submissions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!submissionsData?.hasPrevPage}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={!submissionsData?.hasNextPage}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
