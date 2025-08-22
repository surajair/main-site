import { Loader as _Loader } from "lucide-react";

export default function Loader({
  children,
  fullscreen = true,
  className = "",
}: {
  children?: any;
  fullscreen?: boolean;
  className?: string;
}) {
  if (!fullscreen)
    return (
      <div
        className={`animate-spin w-5 h-5 border-2 border-dashed rounded-full border-fuchsia-500 ${className}`}
      />
    );
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm pointer-events-none z-[999999]">
      <div
        className={`animate-spin w-8 h-8 border-8 border-dashed rounded-full border-fuchsia-500 ${className}`}
      />
      {children}
    </div>
  );
}
