import Link from "next/link";

const IconSVG = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-audio-lines-icon lucide-audio-lines"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>;

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
        aria-label="Your Brand"
        href="/"
      >
        <div 
          className="bg-primary text-primary-foreground rounded flex items-center justify-center font-bold"
          style={{ width, height }}
        >
          {IconSVG}
        </div>
      </Link>
    ) : (
      <div className="flex-none flex rounded text-xl items-center font-semibold">
        <div 
          className="bg-primary text-primary-foreground rounded flex items-center justify-center font-bold"
          style={{ width, height }}
        >
         {IconSVG}
        </div>
      </div>
    )}
  </div>
);