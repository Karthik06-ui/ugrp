import { useQuery } from '@tanstack/react-query'
import { Award } from 'lucide-react'
import { listReviews } from '../../api/dashboard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-lg leading-none ${s <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="ml-1.5 text-sm font-bold text-gray-700">{rating}/5</span>
    </div>
  )
}

export default function MyReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => listReviews().then(r => r.data),
  })

  if (isLoading) return <PageSpinner />
  const reviews = data || []

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <PageWrapper title="Reviews received" subtitle="Formal feedback from your mentors">
      {reviews.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No reviews yet"
          description="Mentors will write reviews once you start contributing to their projects."
        />
      ) : (
        <>
          {/* Summary */}
          <div className="card p-5 mb-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">{avg}</p>
              <p className="text-xs text-gray-400 mt-1">Average rating</p>
            </div>
            <div className="h-12 w-px bg-gray-100" />
            <div className="flex flex-col gap-1.5 flex-1">
              {[5, 4, 3, 2, 1].map(s => {
                const count = reviews.filter(r => r.rating === s).length
                const pct   = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{s}★</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-3">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{r.project_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Review by {r.mentor_email}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                {r.comment ? (
                  <blockquote className="border-l-2 border-amber-300 pl-3 text-sm text-gray-600 leading-relaxed italic">
                    "{r.comment}"
                  </blockquote>
                ) : (
                  <p className="text-sm text-gray-400 italic">No written comment.</p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  {format(new Date(r.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  )
}