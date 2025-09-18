import Link from "next/link";
import { BrandLogo, BrandName } from "../branding";

async function TopNavigation() {
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full container">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-x-2">
            <BrandLogo shouldRedirect={false} />
            <BrandName />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TopNavigation;
