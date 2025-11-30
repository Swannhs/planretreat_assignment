interface ErrorStateProps {
  title?: string
  message: string
  code?: string
  status?: number
}

export default function ErrorState({ title = 'Unable to load venues', message, code, status }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-red-100">
        <h1 className="text-2xl font-bold text-red-700 mb-3">{title}</h1>
        <p className="text-slate-600 mb-2">{message}</p>
        {code && <p className="text-slate-500 text-sm mb-1">Error code: {code}</p>}
        {status && <p className="text-slate-500 text-sm mb-3">HTTP status: {status}</p>}
        <p className="text-slate-500 text-sm">Please check your connection and API service, then refresh.</p>
      </div>
    </div>
  )
}
