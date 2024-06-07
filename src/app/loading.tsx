import { cn } from "@/lib/utils";

export default function Loading({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        `inline-block m-auto h-8 w-8 animate-spin rounded-full border-4 border-white border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`,
        className
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
