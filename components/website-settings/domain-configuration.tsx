"use client";

import { addDomain, verifyDomain } from "@/actions/add-domain-action";
import { updateSubdomain } from "@/actions/update-site-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCanAddDomain } from "@/hooks/use-can-add-domain";
import { Site } from "@/lib/getter/sites";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, CheckCircle, Copy, ExternalLink, Loader, Pencil, RefreshCw } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import UpgradeModalButton from "../upgrade/upgrade-modal-button";
import DeleteDomainModal from "./delete-domain-modal";

interface DomainConfigurationProps {
  websiteId: string;
  data: Site;
}

function DomainConfiguration({ websiteId, data }: DomainConfigurationProps) {
  const subdomainSuffix = process.env.NEXT_PUBLIC_SUBDOMAIN;
  const queryClient = useQueryClient();
  const [customDomain, setCustomDomain] = useState("");
  const [isDomainVerified, setIsDomainVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [domainConfig, setDomainConfig] = useState<any>({});
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const { isCustomDomainLimitReached, customDomainLimit } = useCanAddDomain();

  const subdomainBase = useMemo(() => {
    if (!data.subdomain) return "";
    const suffix = subdomainSuffix ? `.${subdomainSuffix}` : "";
    return suffix && data.subdomain.endsWith(suffix) ? data.subdomain.slice(0, -suffix.length) : data.subdomain;
  }, [data.subdomain, subdomainSuffix]);
  const [subdomainInput, setSubdomainInput] = useState(subdomainBase);

  const [_, saveSubdomain, savingSubdomain] = useActionState(async () => {
    let name = subdomainInput?.trim().toLowerCase();
    if (!name) {
      toast.error("Subdomain is required");
      return { success: false } as any;
    }
    const suffix = subdomainSuffix ? `.${subdomainSuffix}` : "";
    if (suffix && name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length);
    }
    if (name.includes(".")) {
      name = name.split(".")[0];
    }
    const sanitized = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (!sanitized) {
      toast.error("Enter a valid subdomain");
      return { success: false } as any;
    }
    const res = await updateSubdomain(data.id, sanitized);
    if (res.success) {
      toast.success("Subdomain updated");
      queryClient.invalidateQueries({ queryKey: ["website-settings"] }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["DOMAINS_COUNT"] });
      });
      setEditingSubdomain(false);
    } else {
      toast.error(res.error || "Failed to update subdomain");
    }
    return res as any;
  }, null as any);

  const defaultDomains = useMemo(() => {
    const displayDomains = [];
    // Show domain if available and configured, otherwise show subdomain
    if (data.domain && isDomainVerified) {
      displayDomains.push(data.domain);
    }
    if (data.subdomain) {
      displayDomains.push(data.subdomain);
    }
    return displayDomains;
  }, [isDomainVerified, data.domain, data.subdomain]);

  const [, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isCustomDomainLimitReached) {
        toast.error("Please upgrade to add custom domains", { position: "top-center" });
        return { success: false, error: "Please upgrade to add custom domains" };
      }
      const domain = formData.get("customDomain") as string;
      if (!domain) {
        toast.error("Domain is required");
        return { success: false, error: "Domain is required" };
      }

      const result = await addDomain(websiteId, domain);
      if (result.success) {
        setCustomDomain("");
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });
        toast.success("Domain added successfully!");
      } else {
        toast.error(result.error || "Failed to add domain");
      }
      return result;
    },
    { success: false, error: "" },
  );

  const handleCopyValue = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      // Reset the copied state after 5 seconds
      setTimeout(() => {
        setCopiedValue(null);
      }, 5000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleVerifyDomain = async (domain: string, showToast: boolean = true) => {
    setIsVerifying(true);
    try {
      const result = await verifyDomain(domain);
      setDomainConfig(result.data);
      setIsDomainVerified(result.configured);
      if (showToast) {
        if (result.configured) {
          toast.success("Domain is now configured!");
        } else {
          toast.info("Domain is still not configured.");
        }
      }
    } catch (error) {
      if (showToast) {
        toast.error("Failed to verify domain");
      }
    }
    setIsVerifying(false);
  };

  // Auto-verify domain when component mounts
  useEffect(() => {
    if (data.domain) {
      handleVerifyDomain(data.domain, false);
    }
  }, [data.domain]);

  if (!defaultDomains.length) return null;

  return (
    <section id="domain" className="space-y-4">
      <div className="p-1 rounded-lg">
        {defaultDomains.map((domain) => (
          <a
            key={domain}
            className="flex items-center gap-x-2 text-blue-500 hover:text-primary text-sm"
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            {domain}
            <ExternalLink className="h-4 w-4" />
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {/* Default Subdomain */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          {!editingSubdomain ? (
            <div className="flex items-center w-full justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{data.subdomain}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Subdomain</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSubdomainInput(subdomainBase);
                    setEditingSubdomain(true);
                  }}
                  title="Edit subdomain">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <form action={saveSubdomain} className="flex justify-between w-full items-center gap-2">
              <div className="flex items-center gap-1 border rounded-md px-2">
                <Input
                  value={subdomainInput}
                  onChange={(e) => {
                    const raw = e.target.value.toLowerCase().trim();
                    const suffix = subdomainSuffix ? `.${subdomainSuffix}` : "";
                    let withoutSuffix = raw;
                    if (suffix && withoutSuffix.endsWith(suffix)) {
                      withoutSuffix = withoutSuffix.slice(0, -suffix.length);
                    }
                    if (withoutSuffix.includes(".")) {
                      withoutSuffix = withoutSuffix.split(".")[0];
                    }
                    const sanitized = withoutSuffix.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                    setSubdomainInput(sanitized);
                  }}
                  placeholder="subdomain"
                  className="w-64 shrink-0 border-0 shadow-none rounded-none px-0"
                />
                {subdomainSuffix ? <span className="font-light text-gray-500 text-sm">.{subdomainSuffix}</span> : null}
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" disabled={!!savingSubdomain || subdomainInput === subdomainBase}>
                  {savingSubdomain ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingSubdomain(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Custom Domain */}
        {data.domain ? (
          <div className="space-y-3">
            <div className="p-3 space-y-3 border rounded-lg">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDomainVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">{data.domain}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={isDomainVerified ? "outline" : "secondary"}>
                    {isDomainVerified ? "Configured" : "Not Configured"}
                  </Badge>
                  {!isDomainVerified && (
                    <Button
                      size="sm"
                      variant={isVerifying ? "ghost" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isVerifying) return;
                        handleVerifyDomain(data.domain!, true);
                      }}
                      className={isVerifying ? "text-primary border-primary/30 pointer-events-none" : ""}
                      disabled={isDomainVerified}>
                      {isVerifying ? (
                        <>
                          <Loader className="h-3 w-3 animate-spin" />
                          Checking
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Refresh
                        </>
                      )}
                    </Button>
                  )}
                  {!isVerifying && <DeleteDomainModal websiteId={websiteId} domain={data.domain!} />}
                </div>
              </div>

              {!isVerifying &&
                !isDomainVerified &&
                typeof domainConfig === "object" &&
                Object.keys(domainConfig).length > 0 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="space-y-3">
                        <p className="text-sm text-yellow-900 font-medium">
                          The DNS records at your provider must match the following records to verify and connect your
                          domain.
                        </p>

                        {/* DNS Records Table */}
                        <div className="mt-4">
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b">Type</th>
                                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b">Name</th>
                                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-b">Value</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {/* A Records - Show from API or fallback */}
                                {domainConfig?.a && (
                                  <tr>
                                    <td className="px-4 py-3   text-gray-900">A</td>
                                    <td className="px-4 py-3   text-gray-900">@</td>
                                    <td className="px-4 py-3   text-gray-900">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{domainConfig?.a}</span>
                                        <button
                                          onClick={() => handleCopyValue(domainConfig?.a, "A")}
                                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                                          title="Copy A record value">
                                          {copiedValue === domainConfig?.a ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                          ) : (
                                            <Copy className="h-4 w-4 text-gray-500" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}

                                {/* TXT Record for verification */}
                                {domainConfig?.txtValue && (
                                  <tr>
                                    <td className="px-4 py-3   text-gray-900">TXT</td>
                                    <td className="px-4 py-3   text-gray-900">_vercel</td>
                                    <td className="px-4 py-3   text-gray-900">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm break-all">{domainConfig?.txtValue}</span>
                                        <button
                                          onClick={() => handleCopyValue(domainConfig?.txtValue, "TXT")}
                                          className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                          title="Copy TXT record value">
                                          {copiedValue === domainConfig?.txtValue ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                          ) : (
                                            <Copy className="h-4 w-4 text-gray-500" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <form action={addDomainAction} className="space-y-1 pt-2">
            <input type="hidden" name="websiteId" value={websiteId} />
            <Label htmlFor="custom-domain" className="text-xs">
              Add custom domain
            </Label>
            <div className={`flex gap-2`}>
              <Input
                id="custom-domain"
                name="customDomain"
                value={customDomain}
                onChange={(e) =>
                  setCustomDomain(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9.-]/g, ""),
                  )
                }
                placeholder="example.com"
                className=" "
                disabled={addDomainPending || isCustomDomainLimitReached}
              />
              <Button
                variant={addDomainPending ? "ghost" : "default"}
                type="submit"
                className={addDomainPending ? "text-primary pointer-events-none" : ""}
                disabled={addDomainPending || customDomain.length < 3 || isCustomDomainLimitReached}>
                {addDomainPending ? (
                  <>
                    <Loader className="h-3 w-3 animate-spin" />
                    Adding
                  </>
                ) : (
                  "Add Domain"
                )}
              </Button>
            </div>
            {isCustomDomainLimitReached && (
              <div className="space-y-2 mt-4 text-sm text-muted-foreground border bg-muted p-4 rounded-md">
                {customDomainLimit === 0 ? (
                  <div>Please upgrade to add custom domains</div>
                ) : (
                  <div>
                    You have reached the limit of {customDomainLimit} custom domains. Please upgrade to add more.
                  </div>
                )}
                <UpgradeModalButton />
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

DomainConfiguration.displayName = "DomainConfiguration";

export default DomainConfiguration;
