import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full uppercase tracking-wider">
          ✦ 404 — Page Not Found
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-navy-900 tracking-tight">
          Lost in Discovery?
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The verified business or page you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-brand-500/20 transition"
          >
            Return to BharatBN Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
