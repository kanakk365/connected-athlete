import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <span className="text-[150px] font-extrabold tracking-tighter text-muted-foreground/10 select-none">
              404
            </span>
          </div>
          <div className="relative flex justify-center pb-4">
            <div className="bg-red-500/10 p-4 rounded-full mt-10">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
            been moved or deleted.
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-blue-50 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:ring-2 hover:ring-blue-500/50 transition-all gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
