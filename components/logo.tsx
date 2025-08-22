import Image from "next/image";
import Link from "next/link";

export const Logo = ({
  width = 30,
  height = 30,
  shouldRedirect = true, // New prop with default value
}: {
  width?: number;
  height?: number;
  shouldRedirect?: boolean; // Type definition for the new prop
}) => (
  <div className="rounded-lg">
    {shouldRedirect ? ( // Conditional rendering based on shouldRedirect
      <Link
        className="flex-none flex rounded text-xl items-center font-semibold focus:outline-none focus:opacity-80"
        aria-label="Chai Builder"
        href="https://www.chaibuilder.com"
      >
        <Image
          src={"https://ucarecdn.com/fbfc3b05-cb73-4e99-92a2-3a367b7c36cd/"}
          alt=""
          loading="lazy"
          width={width}
          height={height}
          decoding="async"
          data-nimg="1"
          className="text-primary-400 dark:text-primary-300 rounded"
        />
      </Link>
    ) : (
      <div className="flex-none flex rounded text-xl items-center font-semibold">
        <Image
          src={"https://ucarecdn.com/fbfc3b05-cb73-4e99-92a2-3a367b7c36cd/"}
          alt=""
          loading="lazy"
          width={width}
          height={height}
          decoding="async"
          data-nimg="1"
          className="text-primary-400 dark:text-primary-300 rounded"
        />
      </div>
    )}
  </div>
);