export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <div className="flex-1 min-w-0 p-6">
      {(title || actions) && (
        <div className="page-header">
          <div>
            {title && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}