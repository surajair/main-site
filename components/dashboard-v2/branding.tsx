import Link from "next/link";

export const BrandLogo = ({
  width = 30,
  height = 30,
  shouldRedirect = true,
}: {
  width?: number;
  height?: number;
  shouldRedirect?: boolean;
}) => {
  const Logo = () => {
    return (
      <div
        className="bg-primary text-primary-foreground rounded flex items-center justify-center font-bold text-sm"
        style={{ width, height }}>
        <div className="w-3 h-3 rounded-full bg-primary-foreground" />
      </div>
    );
  };
  return shouldRedirect ? (
    <Link aria-label="Website Builder" href="/">
      <Logo />
    </Link>
  ) : (
    <Logo />
  );
};

export const BrandName = () => {
  return <span>YOUR BRAND</span>;
};
