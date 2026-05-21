const variants = {
  pending:     'bg-amber-50  text-amber-700  border-amber-200',
  accepted:    'bg-teal-50   text-teal-700   border-teal-200',
  rejected:    'bg-red-50    text-red-600    border-red-200',
  open:        'bg-green-50  text-green-700  border-green-200',
  closed:      'bg-gray-100  text-gray-500   border-gray-200',
  todo:        'bg-gray-100  text-gray-600   border-gray-200',
  in_progress: 'bg-brand-50  text-brand-600  border-brand-200',
  done:        'bg-teal-50   text-teal-700   border-teal-200',
  student:     'bg-teal-50   text-teal-700   border-teal-200',
  mentor:      'bg-coral-50  text-coral-700  border-coral-200',
}

const labels = {
  in_progress: 'In Progress',
}

export default function Badge({ status }) {
  const cls = variants[status] || 'bg-gray-100 text-gray-500 border-gray-200'
  const text = labels[status] || status?.charAt(0).toUpperCase() + status?.slice(1)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {text}
    </span>
  )
}