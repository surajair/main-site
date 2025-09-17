import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const positionOptions = {
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
} as const;

const ChaiBuilderBadge = ({ position = "bottom-left" }: { position?: keyof typeof positionOptions }) => {
  return (
    <div className={`fixed ${positionOptions[position]} z-50`}>
      <Link href={"https://www.chaibuilder.com"} target="_blank" className="cursor-pointer">
        <Badge
          variant="default"
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium bg-black hover:bg-black border-[1px] border-purple-400 text-white  rounded-full">
          <div className="w-5 h-5 mr-1 rounded flex items-center justify-center">
            <Image src="/assets/chai-builder-logo.png" alt="Chai Builder" className="rounded" width={18} height={18} unoptimized/>
          </div>
          <span className="font-normal">Made with</span>
          <span className="font-bold">Chai Builder</span>
        </Badge>
      </Link>
    </div>
  );
};

export default ChaiBuilderBadge;
