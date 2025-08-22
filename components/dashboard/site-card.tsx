"use client";
import { SiteMenu, SiteModals } from "@/components/dashboard/site-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Site } from "@/utils/types";
import { kebabCase } from "lodash";
import { Check, Copy, Key, Laptop, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

function isNew(site: Site) {
  return (
    new Date().getTime() - new Date(site.createdAt).getTime() < 2 * 60 * 1000
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CommandComponent = ({ site }: { site: Site }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `npx @chaibuilder/create ${kebabCase(site.name)} -key=${site.apiKey}`
      );
      setCopied(true);
      toast.success("Copied to clipboard", { position: "top-center" });
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 4000);
      return () => clearTimeout(timeoutId);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const copyButtonClass = copied
    ? "bg-green-500/10 border-green-500 text-green-700"
    : "bg-primary/10 border-primary text-primary hover:bg-primary/20";

  return (
    <div
      onClick={handleCopy}
      className="bg-muted h-7 w-full overflow-hidden py-1 pl-2 rounded-md flex items-center justify-between"
    >
      <span
        className="font-mono text-sm w-full whitespace-nowrap truncate overflow-hidden text-foreground"
        style={{ userSelect: "none" }}
      >
        npx @chaibuilder/create {kebabCase(site.name)} -key={"<API_KEY>"}
      </span>
      <button
        className={`pl-3 group-hover:pl-2 pr-2 py-0.5 mr-2 h-max rounded-full flex items-center text-xs gap-x-1 ${copyButtonClass}`}
        aria-label={
          copied ? "Command copied to clipboard" : "Copy command to clipboard"
        }
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span
          className={
            copied
              ? ""
              : "w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 duration-300"
          }
        >
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
};

export default function SiteCard({
  site,
  index,
}: {
  site: Site;
  index: number;
}) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Card
        onClick={(e) => {
          setShowDetailsModal(true);
        }}
        className="relative mx-auto flex flex-col justify-between w-full sm:max-w-md group overflow-hidden hover:border-muted-foreground/30 cursor-pointer"
      >
        {isNew(site) && (
          <div className="bg-green-600 px-3 py-1.5 text-white absolute top-0 left-0 text-xs rounded-br-lg z-10">
            New
          </div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <SiteMenu
            site={site}
            showDetailsModal={showDetailsModal}
            setShowDetailsModal={setShowDetailsModal}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        </div>
        <CardHeader className="flex flex-col items-center pt-8 pb-2">
          <h1 className="text-5xl text-muted-foreground font-black group-hover:text-primary duration-300">
            <span className="text-muted-foreground/60 font-light">#</span>
            {index + 1}
          </h1>
          <CardTitle className="pt-3 text-xl font-black text-foreground text-center pb-0">
            {site.name}
            <div className="text-xs text-muted-foreground text-center pt-1 leading-none font-normal">
              {formatDate(site.createdAt)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 justify-start px-2 pb-2 scale-95">
          <small className="text-muted-foreground font-light">
            Run this command in your terminal to setup locally
          </small>
          <CommandComponent site={site} />

          <small className="text-muted-foreground font-light">
            OR follow the instructions from our documentation
          </small>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/docs/developers/getting-started/setup-locally"
              target="_blank"
              className="w-max"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="max-w-[150px] min-w-[150px] bg-accent border-border hover:bg-accent/80 h-max w-max py-1.5 duration-300 text-xs"
              >
                <Laptop className="h-3 w-3" />
                Setup locally
              </Button>
            </Link>
            <Link
              href="/docs/developers/getting-started/deploy-to-vercel"
              target="_blank"
              className="w-max"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="max-w-[150px] bg-accent border-border hover:bg-accent/80 h-max w-max py-1.5 duration-300 text-xs"
              >
                <Rocket className="h-3 w-3" />
                Deploy to Vercel
              </Button>
            </Link>
          </div>
          <small className="text-muted-foreground font-light">
            Get your API key from here
          </small>
          <div className="w-full flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-accent border-border hover:bg-accent/80 duration-300 text-xs h-max py-1.5 min-w-[300px]"
            >
              <Key className="h-3 w-3" />
              View API key
            </Button>
          </div>
        </CardFooter>
      </Card>
      <SiteModals
        site={site}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
    </>
  );
}
