import { useQuery } from '@tanstack/react-query'
import { Award } from 'lucide-react'
import { listReviews } from '../../api/dashboard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

function StarRating({ rating, showNumber = true }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-[17px] leading-none ${s <= rating ? 'text-amber-450 font-bold' : 'text-slate-200'}`}>★</span>
      ))}
      {showNumber && (
        <span className="ml-2 text-[11px] font-extrabold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg">{rating}/5</span>
      )}
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
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No reviews yet"
          description="Mentors will write reviews once you start contributing to their projects."
        />
      ) : (
        <div className="space-y-8 relative z-10">
          {/* Summary Card */}
          <div className="relative overflow-hidden bg-white border border-slate-100/90 rounded-[28px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgb(15,23,42,0.015)]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center md:px-6 relative z-10 flex-shrink-0">
              <p className="text-[56px] font-semibold leading-none tracking-[-0.05em] text-slate-900">{avg}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Average rating</p>
              <div className="mt-2.5 flex justify-center">
                <StarRating rating={Math.round(parseFloat(avg || '0'))} showNumber={false} />
              </div>
            </div>
            
            <div className="hidden md:block h-16 w-px bg-slate-100 relative z-10" />
            
            <div className="flex flex-col gap-2.5 flex-1 w-full max-w-md relative z-10">
              {[5, 4, 3, 2, 1].map(s => {
                const count = reviews.filter(r => r.rating === s).length
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 w-6 flex items-center justify-end gap-0.5">{s}★</span>
                    <div className="flex-1 h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 w-4 text-left">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Reviews</h3>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="group relative overflow-hidden rounded-[26px] bg-white border border-slate-100/80 p-6.5 flex flex-col gap-4.5 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100/80 relative z-10">
                    <div>
                      <p className="font-bold text-[15px] text-slate-900 group-hover:text-indigo-650 transition-colors leading-snug line-clamp-1">{r.project_title}</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                        <span>Review by {r.mentor_email}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <StarRating rating={r.rating} />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    {r.comment ? (
                      <blockquote className="text-[13px] text-slate-650 leading-relaxed bg-slate-50/60 p-4.5 rounded-2xl border border-slate-100/50 italic">
                        "{r.comment}"
                      </blockquote>
                    ) : (
                      <p className="text-[13px] text-slate-400 italic">No written comment.</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-405 relative z-10 pt-1.5 border-t border-slate-50">
                    <span>Submitted on</span>
                    <span>{format(new Date(r.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}