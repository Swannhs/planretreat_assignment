export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-slate-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-blue-600 transition-colors shadow-md"
        >
          Back to home
        </a>
      </div>
    </div>
  )
}
