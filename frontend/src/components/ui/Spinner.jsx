export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' }
  return (
    <div className={`${s[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin ${className}`} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  )
}