"use client";

import { createApiKey } from "@/actions/create-site-action";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, Eye, EyeOff, Key, Loader, RotateCcw } from "lucide-react";
import Form from "next/form";
import { useActionState, useState } from "react";
import { toast } from "sonner";

interface ApiKeySectionProps {
  websiteId: string;
  siteData: {
    id: any;
    name: any;
    createdAt: any;
    fallbackLang: any;
    languages: any;
    app_api_keys: { apiKey: any }[];
  };
  initialApiKey?: string;
}

function ApiKeySection({ websiteId, siteData, initialApiKey }: ApiKeySectionProps) {
  const [apiKey, setApiKey] = useState(
    initialApiKey ||
      (siteData.app_api_keys && siteData.app_api_keys[0]?.apiKey) ||
      `sk_${websiteId}_1234567890abcdef...`,
  );
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [apiKeyState, apiKeyAction, apiKeyPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createApiKey(siteData.id);
      if (result.success && result.apiKey) {
        setApiKey(result.apiKey);
        toast.success("New API key generated successfully");
      } else {
        toast.error(result.error || "Failed to generate new API key");
      }
      return result;
    },
    { success: false, error: "" },
  );

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied.");
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <section id="api-key" className="space-y-4 pt-8">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5" />
        <h2 className=" font-semibold">API Key</h2>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Website API Key</CardTitle>
          <CardDescription>Use this key to authenticate API requests to your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input
                value={showApiKey ? apiKey : "****************************************"}
                readOnly
                type={showApiKey ? "text" : "password"}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? "Hide API Key" : "Show API Key"}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Keep your API key secure and never share it publicly.</p>
          </div>
          <Separator />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCopyKey}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revoke & Generate New
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately revoke your current API key and generate a new one. Any applications using the
                    current key will stop working until updated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Form action={apiKeyAction}>
                    <AlertDialogAction
                      type="submit"
                      disabled={apiKeyPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {apiKeyPending ? (
                        <>
                          <Loader className="h-3 w-3 animate-spin" />
                          Revoking
                        </>
                      ) : (
                        "Revoke & Generate New"
                      )}
                    </AlertDialogAction>
                  </Form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

ApiKeySection.displayName = "ApiKeySection";

export default ApiKeySection;
