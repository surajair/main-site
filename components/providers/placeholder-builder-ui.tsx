import {
  ChevronsDownUp,
  ChevronsUpDown,
  CircleArrowOutUpRight,
  Eye,
  Layers,
  Settings2,
  Sparkle,
  User,
} from "lucide-react";

export default function PlaceholderBuilderUI({
  brandLogo,
  brandName,
  children,
}: {
  brandLogo?: React.ReactNode;
  brandName?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen fixed inset-0 bg-white">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        {children}
      </div>
      <div className="h-12 w-full bg-white border-b flex items-center px-2 gap-2">
        {brandLogo}
        {brandName}
      </div>
      <div className="h-[calc(100%-48px)] w-full bg-white border-b flex">
        <div className="w-12 h-full border-r flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 flex items-center justify-center">
              <Sparkle className="h-5 w-5" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="w-10 h-10 flex items-center justify-center">
              <CircleArrowOutUpRight className="h-5 w-5" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="w-96 h-full border-r px-3">
          <div className="no-scrollbar h-max flex items-center justify-between">
            <div className="flex h-10 items-center space-x-1 text-base font-bold ">
              <span>Outline</span>
            </div>
            <div className="flex items-center gap-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
              <ChevronsDownUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="w-full h-5 bg-gray-100 mt-2" />
          <div className="w-full h-5 bg-gray-100 mt-2" />
          <div className="w-full h-5 bg-gray-100 mt-2" />
          <div className="w-full h-5 bg-gray-100 mt-2" />
          <div className="w-full h-5 bg-gray-100 mt-2" />
        </div>

        <div className="w-full h-full" />
        <div className="w-96 h-full border-l">
          <div className="space-y-4 rounded-xl p-4 text-muted-foreground mt-8 flex items-center flex-col">
            <Settings2 />
            <h1 className="text-center">Please select a block to edit settings or styles</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
