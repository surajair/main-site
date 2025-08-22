import Link from "next/link";

export const Logo = ({
  width = 30,
  height = 30,
  shouldRedirect = true,
}: {
  width?: number;
  height?: number;
  shouldRedirect?: boolean;
}) => (
  <div className="rounded-lg">
    {shouldRedirect ? (
      <Link
        className="flex-none flex rounded text-xl items-center font-semibold focus:outline-none focus:opacity-80"
        aria-label="Website Builder"
        href="/"
      >
        <div 
          className="bg-primary text-primary-foreground rounded flex items-center justify-center font-bold"
          style={{ width, height }}
        >
          WB
        </div>
      </Link>
    ) : (
      <div className="flex-none flex rounded text-xl items-center font-semibold">
        <div 
          className="bg-primary text-primary-foreground rounded flex items-center justify-center font-bold"
          style={{ width, height }}
        >
          WB
        </div>
      </div>
    )}
  </div>
);