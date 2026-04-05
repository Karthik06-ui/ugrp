import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Calendar, User, MessageSquare,
  LogIn, Clock, CheckCircle2, XCircle, RefreshCw,
} from 'lucide-react'
import { getProject } from '../../api/projects'
import { submitProposal, getStudentProposals } from '../../api/proposals'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ProposalForm from '../../components/proposals/ProposalForm'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { listRemarks, createRemark } from '../../api/dashboard'

// ── Proposal status banner shown instead of the apply button ─────────────────
function ProposalStatusBanner({ proposal, onReApply }) {
  if (proposal.status === 'pending') {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
        <Clock size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Proposal under review</p>
          <p className="text-xs text-amber-600 mt-0.5">
            You applied on {format(new Date(proposal.created_at), 'MMM d, yyyy')}.
            The mentor will accept or reject your proposal soon.
          </p>
          <Link
            to="/student/proposals"
            className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium
                       underline underline-offset-2 hover:text-amber-900 mt-1.5"
          >
            View in my proposals →
          </Link>
        </div>
      </div>
    )
  }

  if (proposal.status === 'accepted') {
    return (
      <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3.5">
        <CheckCircle2 size={17} className="text-teal-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-teal-800">You are enrolled in this project!</p>
          <p className="text-xs text-teal-600 mt-0.5">
            Your proposal was accepted. Check your enrollments and assigned tasks.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Link to="/student/enrollments" className="btn-success text-xs py-1 px-3">
              My enrollments
            </Link>
            <Link to="/student/tasks" className="btn-secondary text-xs py-1 px-3">
              My tasks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (proposal.status === 'rejected') {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
        <XCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">Your previous proposal was rejected</p>
          <p className="text-xs text-red-600 mt-0.5">
            You can submit a new proposal with an updated message.
          </p>
          <button
            onClick={onReApply}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700
                       underline underline-offset-2 hover:text-red-900 mt-1.5"
          >
            <RefreshCw size={11} /> Re-apply to this project
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id }   = useParams()
  const { isLoggedIn, isStudent, isMentor, user } = useAuth()
  const qc       = useQueryClient()
  const [applyOpen, setApplyOpen] = useState(false)
  const [remark,    setRemark]    = useState('')

  // Fetch project details (public — no auth needed)
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => getProject(id).then(r => r.data),
  })

  // Fetch all of the student's proposals — find any existing one for this project
  const { data: myProposals = [] } = useQuery({
    queryKey: ['student-proposals'],
    queryFn:  () => getStudentProposals().then(r => r.data),
    enabled:  isStudent,   // only runs when logged-in student
  })

  // The most recent proposal for this project (any status)
  const existingProposal = myProposals
    .filter(p => String(p.project) === String(id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null

  // Can apply if: no existing proposal, OR the most recent one was rejected
  const canApply =
    isStudent &&
    project?.status === 'open' &&
    (!existingProposal || existingProposal.status === 'rejected')

  // Remarks (only for logged-in users)
  const { data: remarks = [] } = useQuery({
    queryKey: ['remarks', id],
    queryFn:  () => listRemarks({ project: id }).then(r => r.data),
    enabled:  !!id && isLoggedIn,
  })

  const proposalMut = useMutation({
    mutationFn: submitProposal,
    onSuccess: () => {
      toast.success('Proposal submitted!')
      setApplyOpen(false)
      // Refresh proposal list so banner updates immediately
      qc.invalidateQueries(['student-proposals'])
    },
    onError: e => toast.error(
      e.response?.data?.non_field_errors?.[0] ||
      e.response?.data?.detail ||
      'Could not submit proposal'
    ),
  })

  const remarkMut = useMutation({
    mutationFn: createRemark,
    onSuccess: () => {
      toast.success('Remark posted')
      setRemark('')
      qc.invalidateQueries(['remarks', id])
    },
    onError: e => toast.error(e.response?.data?.detail || 'Could not post remark'),
  })

  if (projectLoading) return <PageSpinner />
  if (!project)       return <div className="p-6 text-gray-500">Project not found.</div>

  return (
    <div className="p-6 max-w-3xl">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* ── Project header card ──────────────────────────────────────────── */}
      <div className="card p-6 mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{project.title}</h1>
          <Badge status={project.status} />
        </div>
        <p className="text-gray-600 leading-relaxed mb-5">{project.description}</p>
        <div className="flex items-center gap-5 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><User size={13} />{project.mentor_email}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />{format(new Date(project.created_at), 'MMM d, yyyy')}
          </span>
        </div>

        {/* ── CTA section ─────────────────────────────────────────────────── */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">

          {/* 1. Not logged in */}
          {!isLoggedIn && project.status === 'open' && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">Want to apply to this project?</p>
              <Link
                to="/login"
                state={{ from: { pathname: `/projects/${id}` } }}
                className="btn-primary gap-2"
              >
                <LogIn size={14} /> Sign in to apply
              </Link>
            </div>
          )}

          {/* 2. Student: show proposal status banner OR apply button */}
          {isStudent && project.status === 'open' && (
            existingProposal && existingProposal.status !== 'rejected'
              ? (
                // Already has an active/accepted proposal — show status
                <ProposalStatusBanner
                  proposal={existingProposal}
                  onReApply={() => setApplyOpen(true)}
                />
              )
              : (
                // No proposal yet, OR previous was rejected — show apply button
                <div className="flex flex-col gap-3">
                  {existingProposal?.status === 'rejected' && (
                    <ProposalStatusBanner
                      proposal={existingProposal}
                      onReApply={() => setApplyOpen(true)}
                    />
                  )}
                  {canApply && !existingProposal && (
                    <button onClick={() => setApplyOpen(true)} className="btn-primary w-fit">
                      Apply to this project
                    </button>
                  )}
                </div>
              )
          )}

          {/* 3. Project is closed */}
          {isStudent && project.status === 'closed' && (
            <p className="text-sm text-gray-400 italic">
              This project is closed and not accepting new proposals.
            </p>
          )}

          {/* 4. Mentor owns this project */}
          {isMentor && project.mentor === user?.user_id && (
            <Link to="/mentor/projects" className="btn-secondary text-xs w-fit">
              Manage in my projects
            </Link>
          )}
        </div>
      </div>

      {/* ── Remarks section ──────────────────────────────────────────────── */}
      {isLoggedIn ? (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-brand-400" />
            Project remarks
            <span className="text-xs font-normal text-gray-400 ml-1">({remarks.length})</span>
          </h2>

          {remarks.length > 0 ? (
            <div className="space-y-3 mb-4">
              {remarks.map(r => (
                <div key={r.id} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    r.author_role === 'mentor' ? 'bg-coral-50 text-coral-700' : 'bg-teal-50 text-teal-700'
                  }`}>
                    {r.author_email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium text-gray-700">{r.author_email}</span>
                      <span className="text-[10px] text-gray-400">{r.author_role}</span>
                      <span className="text-[10px] text-gray-300">
                        {format(new Date(r.created_at), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{r.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">No remarks yet. Be the first to add one.</p>
          )}

          <div className="flex gap-2 mt-2">
            <input
              value={remark}
              onChange={e => setRemark(e.target.value)}
              className="input flex-1"
              placeholder="Add a remark or progress note…"
              onKeyDown={e => {
                if (e.key === 'Enter' && remark.trim())
                  remarkMut.mutate({ project: id, content: remark })
              }}
            />
            <button
              onClick={() => remark.trim() && remarkMut.mutate({ project: id, content: remark })}
              disabled={!remark.trim() || remarkMut.isPending}
              className="btn-primary px-4"
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-center border-dashed">
          <MessageSquare size={20} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-3">
            Sign in to view project remarks and team updates.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: `/projects/${id}` } }}
            className="btn-secondary text-xs gap-1.5"
          >
            <LogIn size={12} /> Sign in
          </Link>
        </div>
      )}

      {/* ── Apply modal ───────────────────────────────────────────────────── */}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title={`Apply to: ${project.title}`}
      >
        <ProposalForm
          projectId={project.id}
          onSubmit={d => proposalMut.mutate(d)}
          loading={proposalMut.isPending}
        />
      </Modal>
    </div>
  )
}