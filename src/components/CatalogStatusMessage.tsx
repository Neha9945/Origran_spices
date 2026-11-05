import { AlertCircle, Loader2 } from 'lucide-react';

interface CatalogStatusMessageProps {
  status: 'loading' | 'error';
  onRetry: () => void;
}

export default function CatalogStatusMessage({ status, onRetry }: CatalogStatusMessageProps) {
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-espresso-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading our spices...</span>
      </div>
    );
  }

  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-3xl bg-paprika-50 px-6 py-14 text-center">
      <AlertCircle className="h-8 w-8 text-paprika-700" />
      <p className="max-w-md font-medium text-paprika-900">
        We could not load the spice catalog. Please check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-paprika-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-paprika-900"
      >
        Try again
      </button>
    </div>
  );
}
