export default function StatCard({ label, value, icon: Icon, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    teal:  'bg-teal-50  text-teal-600',
    coral: 'bg-coral-50 text-coral-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    red:   'bg-red-50   text-red-500',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  )
}