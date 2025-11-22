import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorFallbackProps {
  /** The specific error message to display to the user. */
  message?: string;
  /** A function to call when the user clicks the retry button. */
  onRetry: () => void;
  /** Optional: Set to true if the fallback should take up the full viewport height. Defaults to false (full container height). */
  fullScreen?: boolean;
}

/**
 * Component for displaying a stylized error message and a retry option.
 */
export default function ErrorFallback({
  message = "An unexpected error occurred while fetching data.",
  onRetry,
  fullScreen = false,
}: ErrorFallbackProps) {
  const containerClass = fullScreen ? "min-h-screen" : "min-h-[40vh] w-full"; // Default minimum height for container use

  return (
    <div className={`${containerClass} flex items-center justify-center p-4`}>
      <div className="text-center space-y-4 max-w-md bg-neutral-900/50 p-8 rounded-2xl border border-red-500/20 backdrop-blur-sm shadow-xl">
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-red-400">Data Load Failed</h3>
        <p className="text-neutral-400">{message}</p>
        <button
          onClick={onRetry}
          className="group relative inline-flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-lg transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-12" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
