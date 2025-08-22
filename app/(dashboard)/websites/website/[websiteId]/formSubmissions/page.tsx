"use client";

import { FormSubmission, getFormSubmissions, GetFormSubmissionsResponse } from "@/actions/get-form-submissions-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Download, FileText, Loader2, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const exportSubmissionsCSV = (websiteId: string) => {};

export default function SubmissionsPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await exportSubmissionsCSV(websiteId);
      const blob = new Blob([csvData as any], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissions-${websiteId}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">Form Submissions</h1>
          <p className="text-muted-foreground mt-2">View and manage form submissions from your website.</p>
        </div>
        <Button onClick={handleExportCSV} disabled={isExporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            {debouncedSearchTerm
              ? `Showing ${submissionsData?.submissions.length || 0} results for "${debouncedSearchTerm}"`
              : "All form submissions from your website visitors"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading submissions...</span>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filteredSubmissions.map((submission: FormSubmission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{submission.formData?.formName || "Unknown Form"}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.formData.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground min-w-[80px]">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{submission.app} Submission</DialogTitle>
                            <DialogDescription>
                              Submitted by {submission.formData.email || "Unknown"} on{" "}
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">ID: {submission.id}</span>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-medium">Form Data:</h4>
                              <div className="bg-muted p-4 rounded-lg space-y-2">
                                {Object.entries(submission.formData).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium capitalize">{key}:</span>
                                    <span className="text-muted-foreground max-w-md text-right">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                              <h4 className="font-medium">Additional Data:</h4>
                              <div className="bg-muted p-4 rounded-lg space-y-2">
                                {Object.entries(submission.additionalData).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium capitalize">{key}:</span>
                                    <span className="text-muted-foreground max-w-md text-right">{String(value)}</span>
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
                <div className="text-center py-8">
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
        </CardContent>
      </Card>
    </div>
  );
}
