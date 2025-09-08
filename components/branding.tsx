import { getBrandConfig } from "@/lib/utils";
import Link from "next/link";

const getLogo = ({ width, height }: { width: number; height: number }) => {
  const brandConfig = getBrandConfig();
  
  if (brandConfig.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brandConfig.logo} width={width} height={height} alt="brand-logo" />;
  }

  return (
    <div
      className="bg-primary text-primary-foreground rounded-3xl flex items-center justify-center font-bold text-sm"
      style={{ width, height }}>
      <div className="w-[50%] h-[50%] rounded-full bg-primary-foreground" />
    </div>
  );
};

export const BrandLogo = ({
  width = 25,
  height = 25,
  shouldRedirect = true,
}: {
  width?: number;
  height?: number;
  shouldRedirect?: boolean;
}) => {
  return shouldRedirect ? (
    <Link aria-label="Website Builder" href="/">
      {getLogo({ width, height })}
    </Link>
  ) : (
    getLogo({ width, height })
  );
};

export const BrandName = ({ className }: { className?: string }) => {
  const brandConfig = getBrandConfig();
  return <span className={`text-sm font-medium ${className}`}>{brandConfig.name || "Your Brand"}</span>;
};
