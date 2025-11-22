import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  /** The message displayed next to the spinner (e.g., "Loading market leaders..."). */
  message?: string;
  /** Optional: Set to true if the spinner should take up the full viewport height. Defaults to false (full container height). */
  fullScreen?: boolean;
}

/**
 * A reusable full-screen or full-container loading indicator component.
 */
export default function LoadingSpinner({
  message = "Loading data...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen ? "min-h-screen" : "min-h-[40vh] w-full"; // Default minimum height for container use

  return (
    <div
      className={`${containerClass} flex items-center justify-center bg-transparent`}
    >
      <div className="flex items-center gap-3 text-amber-400 text-xl font-medium animate-pulse p-4 rounded-xl bg-neutral-900/50 backdrop-blur-sm">
        <Loader2 className="w-6 h-6 animate-spin" />
        {message}
      </div>
    </div>
  );
}
