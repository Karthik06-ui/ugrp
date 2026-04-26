import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Calendar, User, MessageSquare,
  LogIn, Clock, CheckCircle2, XCircle, RefreshCw,
  Building2, BookOpen, AlertCircle,
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

function TypeTag({ type }) {
  if (type === 'industry') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                       bg-teal-50 text-teal-700 border border-teal-200">
        <Building2 size={11} /> Industry Project
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                     bg-brand-50 text-brand-700 border border-brand-200">
      <BookOpen size={11} /> Academic Project
    </span>
  )
}

function ProposalStatusBanner({ proposal, onReApply }) {
  if (proposal.status === 'pending') {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
        <Clock size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Proposal under review</p>
          <p className="text-xs text-amber-600 mt-0.5">
            You applied on {format(new Date(proposal.created_at), 'MMM d, yyyy')}.
            The mentor will respond soon.
          </p>
          <Link to="/student/proposals"
            className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium
                       underline underline-offset-2 hover:text-amber-900 mt-1.5">
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
          <p className="text-xs text-teal-600 mt-0.5">Your proposal was accepted.</p>
          <div className="flex items-center gap-3 mt-2">
            <Link to="/student/enrollments" className="btn-success text-xs py-1 px-3">My enrollments</Link>
            <Link to="/student/tasks"       className="btn-secondary text-xs py-1 px-3">My tasks</Link>
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
          <p className="text-sm font-semibold text-red-800">Previous proposal was rejected</p>
          <p className="text-xs text-red-600 mt-0.5">You may re-apply with an updated message.</p>
          <button onClick={onReApply}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700
                       underline underline-offset-2 hover:text-red-900 mt-1.5">
            <RefreshCw size={11} /> Re-apply to this project
          </button>
        </div>
      </div>
    )
  }
  return null
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { isLoggedIn, isStudent, isMentor, user } = useAuth()
  const qc = useQueryClient()
  const [applyOpen, setApplyOpen] = useState(false)
  const [remark,    setRemark]    = useState('')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => getProject(id).then(r => r.data),
  })

  const { data: myProposals = [] } = useQuery({
    queryKey: ['student-proposals'],
    queryFn:  () => getStudentProposals().then(r => r.data),
    enabled:  isStudent,
  })

  const existingProposal = myProposals
    .filter(p => String(p.project) === String(id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null

  const canApply =
    isStudent &&
    project?.status === 'open' &&
    (!existingProposal || existingProposal.status === 'rejected')

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
      qc.invalidateQueries(['student-proposals'])
    },
    onError: e => toast.error(
      e.response?.data?.non_field_errors?.[0] ||
      e.response?.data?.detail || 'Could not submit proposal'
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

  if (isLoading) return <PageSpinner />
  if (!project)  return <div className="p-6 text-gray-500">Project not found.</div>

  const isIndustry = project.project_type === 'industry'
  const isExpired  = project.deadline && new Date(project.deadline) < new Date()

  return (
    <div className="p-6 max-w-3xl">
      <Link to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* ── Project header ──────────────────────────────────────────────── */}
      <div className="card p-6 mb-5">

        {/* Type + Status tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <TypeTag type={project.project_type} />
          <Badge status={project.status} />
        </div>

        <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4">{project.title}</h1>

        {/* Industry info box */}
        {isIndustry && project.industry_name && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200
                          rounded-xl px-4 py-3 mb-4">
            <Building2 size={16} className="text-teal-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-teal-500 font-medium uppercase tracking-wide">Industry partner</p>
              <p className="text-sm font-bold text-teal-800">{project.industry_name}</p>
            </div>
          </div>
        )}

        <p className="text-gray-600 leading-relaxed mb-5">{project.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-5 text-sm text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5"><User size={13} />{project.mentor_email}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />{format(new Date(project.created_at), 'MMM d, yyyy')}
          </span>
          {project.deadline && (
            <span className={`flex items-center gap-1.5 font-medium ${
              isExpired ? 'text-red-500' : 'text-amber-600'
            }`}>
              <Clock size={13} />
              {isExpired ? 'Deadline passed · ' : 'Deadline: '}
              {format(new Date(project.deadline), 'MMM d, yyyy')}
            </span>
          )}
        </div>

        {/* Deadline expired warning */}
        {isExpired && project.status === 'open' && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200
                          rounded-xl px-4 py-2.5 text-xs text-red-700 font-medium">
            <AlertCircle size={13} />
            The deadline for this project has passed. New proposals may not be reviewed.
          </div>
        )}

        {/* ── CTA section ──────────────────────────────────────────────── */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">

          {/* Not logged in */}
          {!isLoggedIn && project.status === 'open' && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">Want to apply?</p>
              <Link to="/login" state={{ from: { pathname: `/projects/${id}` } }}
                className="btn-primary gap-2">
                <LogIn size={14} /> Sign in to apply
              </Link>
            </div>
          )}

          {/* Student — proposal status or apply button */}
          {isStudent && project.status === 'open' && (
            existingProposal && existingProposal.status !== 'rejected'
              ? <ProposalStatusBanner proposal={existingProposal} onReApply={() => setApplyOpen(true)} />
              : (
                <div className="flex flex-col gap-3">
                  {existingProposal?.status === 'rejected' && (
                    <ProposalStatusBanner proposal={existingProposal} onReApply={() => setApplyOpen(true)} />
                  )}
                  {canApply && !existingProposal && (
                    <button onClick={() => setApplyOpen(true)} className="btn-primary w-fit">
                      Apply to this project
                    </button>
                  )}
                </div>
              )
          )}

          {/* Project closed */}
          {isStudent && project.status === 'closed' && (
            <p className="text-sm text-gray-400 italic">
              This project is closed and not accepting new proposals.
            </p>
          )}

          {/* Mentor owns this project */}
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
                      <span className="text-[10px] text-gray-300">{format(new Date(r.created_at), 'MMM d')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{r.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">No remarks yet.</p>
          )}

          <div className="flex gap-2 mt-2">
            <input value={remark} onChange={e => setRemark(e.target.value)}
              className="input flex-1" placeholder="Add a remark or progress note…"
              onKeyDown={e => { if (e.key === 'Enter' && remark.trim()) remarkMut.mutate({ project: id, content: remark }) }}
            />
            <button
              onClick={() => remark.trim() && remarkMut.mutate({ project: id, content: remark })}
              disabled={!remark.trim() || remarkMut.isPending}
              className="btn-primary px-4"
            >Post</button>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-center border-dashed">
          <MessageSquare size={20} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-3">Sign in to view remarks and team updates.</p>
          <Link to="/login" state={{ from: { pathname: `/projects/${id}` } }}
            className="btn-secondary text-xs gap-1.5">
            <LogIn size={12} /> Sign in
          </Link>
        </div>
      )}

      {/* ── Apply modal ───────────────────────────────────────────────────── */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)}
        title={`Apply to: ${project.title}`} size="lg">
        <ProposalForm
          projectId={project.id}
          onSubmit={d => proposalMut.mutate(d)}
          loading={proposalMut.isPending}
        />
      </Modal>
    </div>
  )
}