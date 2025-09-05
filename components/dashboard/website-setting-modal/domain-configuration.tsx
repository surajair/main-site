"use client";

import { addDomain, verifyDomain } from "@/actions/add-domain-action";
import { updateSubdomain } from "@/actions/update-site-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/lib/getter/sites";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, ExternalLink, Loader, Pencil, RefreshCw } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DeleteDomainModal from "./delete-domain-modal";

interface DomainConfigurationProps {
  websiteId: string;
  siteData: Site;
}

function DomainConfiguration({ websiteId, siteData }: DomainConfigurationProps) {
  const queryClient = useQueryClient();
  const [customDomain, setCustomDomain] = useState("");
  const [verifyingDomains, setVerifyingDomains] = useState<Set<string>>(new Set());
  const [domainConfig, setDomainConfig] = useState<any>(null);
  const [editingSubdomain, setEditingSubdomain] = useState(false);
  const subdomainSuffix = process.env.NEXT_PUBLIC_SUBDOMAIN;
  const subdomainBase = useMemo(() => {
    if (!siteData.subdomain) return "";
    const suffix = subdomainSuffix ? `.${subdomainSuffix}` : "";
    return suffix && siteData.subdomain.endsWith(suffix)
      ? siteData.subdomain.slice(0, -suffix.length)
      : siteData.subdomain;
  }, [siteData.subdomain, subdomainSuffix]);
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
    const res = await updateSubdomain(siteData.id, sanitized);
    if (res.success) {
      toast.success("Subdomain updated");
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
    } else {
      toast.error(res.error || "Failed to update subdomain");
    }
    return res as any;
  }, null as any);

  const defaultDomain = useMemo(() => {
    // Show domain if available and configured, otherwise show subdomain
    if (siteData.domain && siteData.domainConfigured) {
      return siteData.domain;
    }
    return siteData.subdomain;
  }, [siteData]);

  const [addDomainState, addDomainAction, addDomainPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const domain = formData.get("customDomain") as string;
      if (!domain) {
        toast.error("Domain is required");
        return { success: false, error: "Domain is required" };
      }

      const result = await addDomain(siteData, domain);
      if (result.success) {
        setCustomDomain("");
        // Store the domain configuration data
        setDomainConfig(result.data);
        queryClient.invalidateQueries({ queryKey: ["website-settings"] });

        if (result.configured) {
          toast.success("Domain added and configured successfully!");
        } else {
          toast.success("Domain added! Please configure DNS settings to complete setup.");
        }
      } else {
        toast.error(result.error || "Failed to add domain");
      }
      return result;
    },
    { success: false, error: "" },
  );

  const handleVerifyDomain = async (domain: string, showToast: boolean = true) => {
    setVerifyingDomains((prev) => new Set(prev).add(domain));

    try {
      const result = await verifyDomain(domain);
      if (result.success) {
        // Store the domain configuration data
        setDomainConfig(result.data);

        if (showToast) {
          if (result.configured) {
            toast.success("Domain is now configured!");
          } else {
            toast.info("Domain is still not configured.");
          }
        }
      } else {
        if (showToast) {
          toast.error(result.error || "Failed to verify domain");
        }
      }
    } catch (error) {
      if (showToast) {
        toast.error("Failed to verify domain");
      }
    } finally {
      setVerifyingDomains((prev) => {
        const newSet = new Set(prev);
        newSet.delete(domain);
        return newSet;
      });
    }
  };

  // Auto-verify domain when component mounts
  useEffect(() => {
    if (siteData.domain) {
      // Verify domain silently on mount (no toast notifications)
      handleVerifyDomain(siteData.domain, false);
    }
  }, [siteData.domain]);

  if (!defaultDomain) return null;

  return (
    <section id="domain" className="space-y-4">
      <a
        className="flex items-center gap-x-2 text-blue-500 hover:text-primary"
        href={`https://${defaultDomain}`}
        target="_blank"
        rel="noopener noreferrer">
        {defaultDomain}
        <ExternalLink className="h-4 w-4" />
      </a>

      {!siteData.domain && (
        <form action={addDomainAction} className="space-y-1">
          <input type="hidden" name="websiteId" value={websiteId} />
          <Label htmlFor="custom-domain" className="text-xs">
            Domain Name
          </Label>
          <div className="flex gap-2">
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
              disabled={addDomainPending}
            />
            <Button type="submit" disabled={addDomainPending || customDomain.length < 3}>
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
        </form>
      )}

      <div className="space-y-3">
        {/* Default Subdomain */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          {!editingSubdomain ? (
            <div className="flex items-center w-full justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{siteData.subdomain}</span>
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
        {siteData.domain && (
          <div className="space-y-3">
            <div className="p-3 space-y-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {siteData.domainConfigured ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span>{siteData.domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={siteData.domainConfigured ? "outline" : "secondary"}>
                    {siteData.domainConfigured ? "Configured" : "Not Configured"}
                  </Badge>
                  {!siteData.domainConfigured && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerifyDomain(siteData.domain!, true);
                      }}
                      disabled={verifyingDomains.has(siteData.domain!)}>
                      {verifyingDomains.has(siteData.domain!) ? (
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
                  <DeleteDomainModal websiteId={websiteId} domain={siteData.domain!} />
                </div>
              </div>
              {!siteData.domainConfigured && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="space-y-3">
                      <p className="text-sm text-yellow-900 font-medium">
                        The DNS records at your provider must match the following records to verify and connect your
                        domain to Vercel.
                      </p>
                      <a
                        href="https://vercel.com/docs/domains/working-with-domains/add-a-domain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline">
                        Learn more
                      </a>

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
                              {domainConfig?.recommendedIPv4?.length > 0
                                ? domainConfig.recommendedIPv4
                                    .filter(
                                      (record: any) =>
                                        Object.keys(record).length > 0 && (record.value || record.ip || record.address),
                                    )
                                    .map((record: any, index: number) => (
                                      <tr key={`a-${index}`}>
                                        <td className="px-4 py-3   text-gray-900">A</td>
                                        <td className="px-4 py-3   text-gray-900">
                                          {record.name || record.host || "@"}
                                        </td>
                                        <td className="px-4 py-3   text-gray-900">
                                          {record.value || record.ip || record.address}
                                        </td>
                                      </tr>
                                    ))
                                : null}

                              {/* Fallback A record if no valid records from API */}
                              {(!domainConfig?.recommendedIPv4?.length ||
                                !domainConfig.recommendedIPv4.some(
                                  (record: any) =>
                                    Object.keys(record).length > 0 && (record.value || record.ip || record.address),
                                )) && (
                                <tr>
                                  <td className="px-4 py-3   text-gray-900">A</td>
                                  <td className="px-4 py-3   text-gray-900">@</td>
                                  <td className="px-4 py-3   text-gray-900">216.198.79.1</td>
                                </tr>
                              )}

                              {/* CNAME Records - Only show if available from API and not empty */}
                              {domainConfig?.recommendedCNAME?.length > 0 &&
                                domainConfig.recommendedCNAME
                                  .filter(
                                    (record: any) =>
                                      Object.keys(record).length > 0 && (record.value || record.target || record.alias),
                                  )
                                  .map((record: any, index: number) => (
                                    <tr key={`cname-${index}`}>
                                      <td className="px-4 py-3   text-gray-900">CNAME</td>
                                      <td className="px-4 py-3   text-gray-900">{record.name || record.host || "@"}</td>
                                      <td className="px-4 py-3   text-gray-900">
                                        {record.value || record.target || record.alias}
                                      </td>
                                    </tr>
                                  ))}

                              {/* TXT Record for verification */}
                              <tr>
                                <td className="px-4 py-3   text-gray-900">TXT</td>
                                <td className="px-4 py-3   text-gray-900">_vercel</td>
                                <td className="px-4 py-3   text-gray-900">
                                  {domainConfig?.verification
                                    ? `vc-domain-verify=${siteData.domain},${domainConfig.verification}`
                                    : `vc-domain-verify=${siteData.domain},af451ef51bfde534abd2`}
                                </td>
                              </tr>
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
        )}
      </div>
    </section>
  );
}

DomainConfiguration.displayName = "DomainConfiguration";

export default DomainConfiguration;
