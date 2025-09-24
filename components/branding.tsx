import { getClientSettings } from "@/lib/getter";
import { cn } from "@/lib/utils";
import Link from "next/link";

const getClientLogo = async ({ width, height }: { width: number; height: number }) => {
  const clientSettings = await getClientSettings();

  if (clientSettings?.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={clientSettings.logo} width={width} height={height} alt="brand-logo" className="rounded-md" />
    );
  }

  return (
    <div
      className="bg-primary text-primary-foreground rounded-3xl flex items-center justify-center font-bold text-sm"
      style={{ width, height }}>
      <div className="w-[50%] h-[50%] rounded-full bg-primary-foreground" />
    </div>
  );
};

export const BrandLogo = async ({
  width = 25,
  height = 25,
  shouldRedirect = true,
}: {
  width?: number;
  height?: number;
  shouldRedirect?: boolean;
}) => {
  const logo = await getClientLogo({ width, height });
  return shouldRedirect ? (
    <Link aria-label="Website Builder" href="/">
      {logo}
    </Link>
  ) : (
    logo
  );
};

const getClientName = async () => {
  const clientSettings = await getClientSettings();
  return clientSettings?.name;
};

export const BrandName = async ({ className }: { className?: string }) => {
  const name = await getClientName();
  return <span className={cn("text-sm text-primary-foreground font-medium", className)}>{name}</span>;
};
