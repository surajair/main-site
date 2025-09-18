"use client";

import { formSubmit } from "@/actions/form-submit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FEEDBACK_DOMAIN = "chaibuilder.com";

export const SupportPanel = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await formSubmit({
        formData: {
          formName: "Feedback",
          message: feedback,
          submittedAt: new Date().toISOString(),
        },
        additionalData: {
          source: "support-panel",
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          hostname: window.location.hostname,
        },
        domain: FEEDBACK_DOMAIN,
      });

      if (result.success) {
        toast.success("Feedback submitted successfully!");
        // Reset form and close dialog
        setFeedback("");
        setDialogOpen(false);
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="text-start">
        <p className="text-sm text-slate-600">We&apos;re here to support you every step of the way</p>
      </div>
      <div className="space-y-4">
        {/* First Support Email */}
        <div className="group">
          <a
            href="mailto:support@chaibuilder.com"
            className="flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-slate-800">Email support</h4>
              <p className="text-sm text-slate-600">support@chaibuilder.com</p>
            </div>
          </a>
        </div>

        {/* Second Support Email */}
        <div className="group">
          <a
            href="mailto:suraj@chaibuilder.com"
            className="flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-slate-800">Founder email</h4>
              <p className="text-sm text-slate-600">suraj@chaibuilder.com</p>
            </div>
          </a>
        </div>

        {/* Discord Link */}
        <div className="group">
          <a
            href="https://discord.com/invite/czkgwX2rnD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-slate-800">Support on Discord</h4>
              <p className="text-sm text-slate-600">Chat with our community</p>
            </div>
            <Button variant="default" className="rounded-md w-fit px-2 py-0 " size="icon">
              Join
            </Button>
          </a>
        </div>

        {/* Simple Feedback Button */}
        <div className="flex justify-center pt-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-600" />
                  Send Feedback
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label htmlFor="feedback" className="text-sm font-medium text-slate-700 mb-2 block">
                    Your Feedback
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think, report a bug, or suggest a feature..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="max-h-[200px]"
                    rows={8}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>Send Feedback</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
