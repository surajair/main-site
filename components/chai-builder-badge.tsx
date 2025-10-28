import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const positionOptions = {
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
} as const;

const ChaiBuilderBadge = ({
  position = "bottom-left",
  madeWithBadge,
}: {
  position?: keyof typeof positionOptions;
  madeWithBadge?: string;
}) => {
  return (
    <>
      {madeWithBadge ? (
        <div dangerouslySetInnerHTML={{ __html: madeWithBadge }} />
      ) : (
        <div className={`fixed ${positionOptions[position]} z-50`}>
          <Badge
            variant="default"
            className="p-2 bg-black hover:bg-black border-[1px] border-purple-400 text-white  rounded-full">
            <>
              <Link
                href={"https://www.chaibuilder.com"}
                target="_blank"
                className="cursor-pointer flex items-end justify-center gap-1 text-sm font-medium">
                <div className="w-5 h-5 mr-1 rounded flex items-center justify-center">
                  <Image
                    src="/assets/chai-builder-logo.webp"
                    alt="Chai Builder"
                    className="rounded"
                    width={18}
                    height={18}
                    unoptimized
                  />
                </div>
                <span className="font-normal">Made with</span>
                <span className="font-bold">Chai Builder</span>
              </Link>
            </>
          </Badge>
        </div>
      )}
    </>
  );
};

export default ChaiBuilderBadge;
