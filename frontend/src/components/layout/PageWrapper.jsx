export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <div className="flex-1 min-w-0 p-6 relative overflow-hidden animate-fade-in-up">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-sky-200/20 to-teal-200/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {(title || actions) && (
        <div className="page-header relative z-10">
          <div>
            {title && <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>}
            {subtitle && <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}