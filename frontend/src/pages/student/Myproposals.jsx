import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, BookOpen, ExternalLink, Paperclip } from 'lucide-react'
import { getStudentProposals } from '../../api/proposals'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
]

// ── Empty state messages per tab ─────────────────────────────────────────────
const EMPTY = {
  all: { title: 'No proposals yet', desc: 'Browse open projects and submit your first proposal.' },
  pending: { title: 'No pending proposals', desc: 'All your proposals have already been reviewed.' },
  accepted: { title: 'No accepted proposals yet', desc: 'Keep applying — accepted proposals will appear here.' },
  rejected: { title: 'No rejected proposals', desc: "Great — none of your proposals have been rejected yet." },
}

// ── Single proposal row card ─────────────────────────────────────────────────
function ProposalRow({ proposal }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] bg-white border border-slate-100/80 p-6 flex flex-col gap-4.5 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:-translate-y-1">
      {/* Decorative inner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Project title + status */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mt-0.5 flex-shrink-0">
            <BookOpen size={16} />
          </div>
          <div className="min-w-0 pt-0.5">
            <Link
              to={`/projects/${proposal.project}`}
              className="font-bold text-[15px] text-slate-900 group-hover:text-indigo-650 transition-colors leading-snug line-clamp-1"
            >
              {proposal.project_title || `Project #${proposal.project}`}
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 pt-0.5">
          <Badge status={proposal.status} />
        </div>
      </div>

      {/* Message preview */}
      <p className="text-[13px] text-slate-650 leading-relaxed bg-slate-50/60 p-4.5 rounded-2xl border border-slate-100/50 italic relative z-10">
        "{proposal.message}"
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-50 pt-4 mt-1 relative z-10">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          <span>Applied {format(new Date(proposal.created_at), 'MMM d, yyyy')}</span>
          {proposal.updated_at !== proposal.created_at && (
            <>
              <span className="text-slate-250">·</span>
              <span>Updated {format(new Date(proposal.updated_at), 'MMM d, yyyy')}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Attachment indicator */}
          {proposal.attachment_url && (
            <a
              href={proposal.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/60 border border-indigo-100/40 px-3 py-1.5 rounded-xl transition-all"
              onClick={e => e.stopPropagation()}
            >
              <Paperclip size={12} /> Attachment
            </a>
          )}

          {/* View project link */}
          <Link
            to={`/projects/${proposal.project}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
          >
            <ExternalLink size={12} /> View project
          </Link>
        </div>
      </div>

      {/* Accepted banner */}
      {proposal.status === 'accepted' && (
        <div className="bg-emerald-50/70 border border-emerald-100/60 text-emerald-800 text-xs font-semibold rounded-2xl px-4.5 py-3.5 flex items-center gap-2.5 mt-1 relative z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
          You are enrolled in this project. Check your enrollments and tasks.
        </div>
      )}

      {/* Rejected banner — can re-apply */}
      {proposal.status === 'rejected' && (
        <div className="bg-rose-50/70 border border-rose-100/60 text-rose-800 text-xs font-semibold rounded-2xl px-4.5 py-3.5 flex items-center justify-between gap-2.5 mt-1 relative z-10">
          <span className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            This proposal was rejected. You may re-apply to this project.
          </span>
          <Link
            to={`/projects/${proposal.project}`}
            className="underline underline-offset-2 hover:text-rose-950 font-bold whitespace-nowrap flex-shrink-0 transition-colors"
          >
            Re-apply →
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MyProposals() {
  const [activeTab, setActiveTab] = useState('all')

  // Fetch all proposals — no status filter, we filter client-side for instant tab switching
  const { data: allProposals = [], isLoading } = useQuery({
    queryKey: ['student-proposals'],
    queryFn: () => getStudentProposals().then(r => r.data),
  })

  // Compute counts for each tab badge
  const counts = allProposals.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  // Filter for active tab
  const visible = activeTab === 'all'
    ? allProposals
    : allProposals.filter(p => p.status === activeTab)

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="My proposals"
      subtitle="Track every project application you have submitted"
      actions={
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800">
          <BookOpen size={13} /> Browse projects
        </Link>
      }
    >
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-8 bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit shadow-[0_2px_8px_rgba(15,23,42,0.01)] relative z-10">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? allProposals.length : (counts[key] || 0)
          const isActive = activeTab === key

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${isActive
                  ? 'bg-white text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100/50'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/30'}
              `}
            >
              {label}
              {count > 0 && (
                <span className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                  rounded-full text-[10px] font-extrabold transition-colors
                  ${isActive
                    ? key === 'accepted' ? 'bg-emerald-500 text-white'
                      : key === 'rejected' ? 'bg-rose-500 text-white'
                        : key === 'pending' ? 'bg-amber-500 text-white'
                          : 'bg-indigo-600 text-white'
                    : 'bg-slate-200/80 text-slate-550'}
                `}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Proposal list ─────────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={EMPTY[activeTab].title}
          description={EMPTY[activeTab].desc}
          action={
            activeTab === 'all' || activeTab === 'rejected'
              ? (
                <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800">
                  Browse open projects
                </Link>
              )
              : null
          }
        />
      ) : (
        <div className="space-y-6 relative z-10">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {visible.length} {activeTab === 'all' ? 'total' : activeTab} proposal{visible.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-4">
            {visible.map(p => <ProposalRow key={p.id} proposal={p} />)}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}