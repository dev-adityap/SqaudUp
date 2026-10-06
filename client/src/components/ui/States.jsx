import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 text-[#ff5500] animate-spin" />
      <p className="text-neutral-400 text-sm font-semibold">{label}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#0f0f13] border border-neutral-800 rounded-xl overflow-hidden">
          <div className="h-44 bg-neutral-900 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-neutral-800 rounded animate-pulse" />
            <div className="h-5 w-4/5 bg-neutral-800 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="col-span-full py-16 px-6 text-center border border-dashed border-neutral-800 rounded-2xl bg-[#0f0f13]/50">
      {Icon && <Icon className="w-9 h-9 text-neutral-600 mx-auto mb-4" />}
      <p className="text-neutral-300 font-bold mb-1">{title}</p>
      {description && <p className="text-sm text-neutral-500 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="col-span-full py-16 px-6 text-center border border-red-900/40 rounded-2xl bg-red-950/20">
      <AlertCircle className="w-9 h-9 text-red-400 mx-auto mb-4" />
      <p className="text-red-300 font-bold mb-1">Something went wrong</p>
      <p className="text-sm text-red-400/80 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}
