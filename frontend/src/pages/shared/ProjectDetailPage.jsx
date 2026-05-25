import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Calendar, User, MessageSquare,
  LogIn, Clock, CheckCircle2, XCircle, RefreshCw,
  Building2, BookOpen, AlertCircle, Send,
  Paperclip, ExternalLink, Users, Mail, GraduationCap
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
import PageWrapper from '../../components/layout/PageWrapper'

function TypeTag({ type }) {
  if (type === 'industry') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                       bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wide text-[10px]">
        <Building2 size={11} /> Industry Project
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                     bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide text-[10px]">
      <BookOpen size={11} /> Academic Project
    </span>
  )
}

function ProposalStatusBanner({ proposal, onReApply }) {
  if (proposal.is_draft) {
    return (
      <div className="flex items-start gap-3.5 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-5 py-4 shadow-sm w-full">
        <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">Draft Application Saved</p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            You have a saved draft for this project. The mentor cannot see or review it until you submit.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <button onClick={onReApply}
              className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold
                         underline underline-offset-2 hover:text-amber-900 transition-colors">
              Resume / Edit Draft →
            </button>
            <Link to="/student/proposals"
              className="inline-flex items-center gap-1 text-xs text-slate-500 font-semibold
                         underline underline-offset-2 hover:text-slate-700 transition-colors">
              View in my proposals
            </Link>
          </div>
        </div>
      </div>
    )
  }
  if (proposal.status === 'pending') {
    return (
      <div className="flex items-start gap-3.5 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-5 py-4 shadow-sm">
        <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Proposal Under Review</p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            You applied on {format(new Date(proposal.created_at), 'MMM d, yyyy')}.
            The mentor will review your application soon.
          </p>
          <Link to="/student/proposals"
            className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold
                       underline underline-offset-2 hover:text-amber-900 mt-2 transition-colors">
            View in my proposals →
          </Link>
        </div>
      </div>
    )
  }
  if (proposal.status === 'accepted') {
    return (
      <div className="flex items-start gap-3.5 bg-teal-50/80 border border-teal-200/60 rounded-2xl px-5 py-4 shadow-sm">
        <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-teal-800">Enrolled in Project</p>
          <p className="text-xs text-teal-650 mt-1">Congratulations! Your proposal has been accepted.</p>
          <div className="flex items-center gap-3 mt-3">
            <Link to="/student/enrollments" className="btn-success text-xs py-1.5 px-4 rounded-xl font-bold shadow-sm">My enrollments</Link>
            <Link to="/student/tasks"       className="btn-secondary text-xs py-1.5 px-4 rounded-xl font-bold shadow-sm">My tasks</Link>
          </div>
        </div>
      </div>
    )
  }
  if (proposal.status === 'rejected') {
    return (
      <div className="flex items-start gap-3.5 bg-red-50/80 border border-red-200/60 rounded-2xl px-5 py-4 shadow-sm">
        <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-800">Proposal Declined</p>
          <p className="text-xs text-red-650 mt-1">Your previous proposal was not accepted. You may submit an updated message.</p>
          <button onClick={onReApply}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700
                       underline underline-offset-2 hover:text-red-900 mt-2 transition-colors">
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
    (!existingProposal || existingProposal.status === 'rejected' || existingProposal.is_draft)

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
  if (!project)  return <div className="p-6 text-slate-500">Project not found.</div>

  const enrollments = project.enrollments || []
  const isProjectMentor = isMentor && String(project.mentor) === String(user?.user_id)
  const isEnrolledStudent = isStudent && enrollments.some(e => 
    String(e.student) === String(user?.user_id) || 
    e.member_roles?.some(m => m.email?.toLowerCase().trim() === user?.email?.toLowerCase().trim())
  )
  const canSeeTeam = isProjectMentor || isEnrolledStudent

  const teamEnrollment = enrollments.find(e => e.is_team)
  const individualEnrollments = enrollments.filter(e => !e.is_team)

  const isIndustry = project.project_type === 'industry'
  const isExpired  = project.deadline && new Date(project.deadline) < new Date()

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <Link to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors hover:scale-[1.01]">
          <ArrowLeft size={14} /> Back to projects
        </Link>

        {/* ────────────────────────────────────────────────────────────────────────── */}
        <div className="card p-8 mb-6 bg-white/80 border-slate-100 shadow-lg">

          {/* Type + Status tags */}
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <TypeTag type={project.project_type} />
            <Badge status={project.status} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">{project.title}</h1>

          {/* Industry info box */}
          {isIndustry && project.industry_name && (
            <div className="flex items-center gap-3.5 bg-teal-50/70 border border-teal-100/60
                            rounded-2xl px-5 py-4 mb-5">
              <Building2 size={20} className="text-teal-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Industry Partner</p>
                <p className="text-base font-bold text-teal-900">{project.industry_name}</p>
              </div>
            </div>
          )}

          <p className="text-slate-650 text-base leading-relaxed mb-6 whitespace-pre-line">{project.description}</p>

          {/* Detailed Project Document Link */}
          {project.document_url && (
            <div className="mb-6">
              <a
                href={project.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold
                           bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
              >
                <Paperclip size={14} className="text-slate-500" />
                <span>View Project Details</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-6 text-sm text-slate-400 border-t border-slate-100/80 pt-5 flex-wrap">
            <span className="flex items-center gap-2">
              <User size={15} className="text-slate-400" />
              <span className="font-medium text-slate-600">{project.mentor_email}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-slate-400" />
              <span className="font-medium text-slate-600">{format(new Date(project.created_at), 'MMM d, yyyy')}</span>
            </span>
            {project.deadline && (
              <span className={`flex items-center gap-2 font-semibold px-2.5 py-1 rounded-xl ${
                isExpired ? 'text-red-600 bg-red-50' : 'text-amber-700 bg-amber-50'
              }`}>
                <Clock size={14} />
                <span>{isExpired ? 'Deadline passed' : `Deadline: ${format(new Date(project.deadline), 'MMM d, yyyy')}`}</span>
              </span>
            )}
          </div>

          {/* Deadline expired warning */}
          {isExpired && project.status === 'open' && (
            <div className="mt-4 flex items-center gap-2.5 bg-red-50/70 border border-red-100/50
                            rounded-xl px-4 py-3 text-xs text-red-700 font-semibold shadow-sm">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
              <span>The deadline for this project has passed. New proposals may not be reviewed.</span>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────────────── */}
          <div className="mt-6 pt-5 border-t border-slate-100/80 space-y-4">

            {/* Not logged in */}
            {!isLoggedIn && project.status === 'open' && (
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-sm font-semibold text-slate-500">Interested in this project?</p>
                <Link to="/login" state={{ from: { pathname: `/projects/${id}` } }}
                  className="btn-primary gap-2 px-5 py-2.5">
                  <LogIn size={15} /> Sign in to apply
                </Link>
              </div>
            )}

            {/* Student — proposal status or apply button */}
            {isStudent && project.status === 'open' && (
              existingProposal && existingProposal.status !== 'accepted'
                ? <ProposalStatusBanner proposal={existingProposal} onReApply={() => setApplyOpen(true)} />
                : (
                  <div className="flex flex-col gap-4">
                    {canApply && !existingProposal && (
                      <button onClick={() => setApplyOpen(true)} className="btn-primary w-fit shadow-md shadow-slate-900/10">
                        Apply to this project
                      </button>
                    )}
                  </div>
                )
            )}

            {/* Project closed */}
            {isStudent && project.status === 'closed' && (
              <p className="text-sm text-slate-400 font-semibold italic">
                This project is closed and not accepting new proposals.
              </p>
            )}

            {/* Mentor owns this project */}
            {isMentor && isProjectMentor && (
              <Link to="/mentor/projects" className="btn-secondary text-xs font-bold w-fit shadow-sm">
                Manage in My Projects
              </Link>
            )}
          </div>
        </div>

        {/* ── Enrolled Team/Students Section ──────────────────────────────────────── */}
        {isLoggedIn && canSeeTeam && enrollments.length > 0 && (
          <div className="card p-8 mb-6 bg-white/80 border-slate-100 shadow-lg animate-fade-in-up">
            {teamEnrollment ? (
              <>
                <h2 className="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users size={20} className="text-indigo-500" />
                  <span>Project Team ({teamEnrollment.team_name})</span>
                </h2>
                <div className="space-y-4">
                  {/* Team Lead */}
                  <div className="flex items-start justify-between bg-slate-50/50 p-4.5 rounded-[20px] border border-slate-100/60 flex-wrap gap-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shadow-inner mt-0.5">
                        {teamEnrollment.team_leader_name?.[0]?.toUpperCase() || 'L'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-slate-800">{teamEnrollment.team_leader_name || 'Team Lead'}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-brand-600 text-white uppercase tracking-wide">
                            Team Lead
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>Roll No: {teamEnrollment.team_leader_roll_number || 'N/A'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-355" />
                          <span>Dept: {teamEnrollment.team_leader_department || 'N/A'}</span>
                        </p>
                        <a href={`mailto:${teamEnrollment.team_leader_email}`} className="text-xs text-indigo-650 font-semibold hover:underline mt-2 inline-flex items-center gap-1.5">
                          <Mail size={12} className="text-indigo-400" /> {teamEnrollment.team_leader_email}
                        </a>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                      Registered & Linked
                    </span>
                  </div>

                  {/* Team Members */}
                  {teamEnrollment.member_roles?.map((member, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-slate-50/20 p-4.5 rounded-[20px] border border-slate-100/40 flex-wrap gap-4">
                      <div className="flex gap-3.5 items-start">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shadow-inner mt-0.5">
                          {member.name?.[0]?.toUpperCase() || 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-700">{member.name || 'Unnamed Member'}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase tracking-wide">
                              {member.role_label || member.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span>Roll No: {member.roll_number || 'N/A'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-355" />
                            <span>Dept: {member.department || 'N/A'}</span>
                          </p>
                          <a href={`mailto:${member.email}`} className="text-xs text-indigo-650 font-semibold hover:underline mt-2 inline-flex items-center gap-1.5">
                            <Mail size={12} className="text-indigo-400" /> {member.email}
                          </a>
                        </div>
                      </div>
                      <div>
                        {member.joined ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                            Registered & Linked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                            Awaiting Signup
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Users size={20} className="text-indigo-500" />
                  <span>Enrolled Students</span>
                </h2>
                <div className="space-y-4">
                  {individualEnrollments.map((e, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-slate-50/50 p-4.5 rounded-[20px] border border-slate-100/60 flex-wrap gap-4">
                      <div className="flex gap-3.5 items-start">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner mt-0.5">
                          {e.student_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-slate-800">{e.student_name || 'Enrolled Student'}</span>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span>Roll No: {e.student_roll_number || 'N/A'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-355" />
                            <span>Dept: {e.student_department || 'N/A'}</span>
                          </p>
                          <a href={`mailto:${e.student_email}`} className="text-xs text-indigo-650 font-semibold hover:underline mt-2 inline-flex items-center gap-1.5">
                            <Mail size={12} className="text-indigo-400" /> {e.student_email}
                          </a>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                        Enrolled
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────── */}
        {isLoggedIn ? (
          <div className="card p-8 bg-white/80 border-slate-100 shadow-lg">
            <h2 className="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-500" />
              <span>Project remarks</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-1.5">{remarks.length}</span>
            </h2>

            {remarks.length > 0 ? (
              <div className="space-y-4 mb-6 border-b border-slate-100/60 pb-6">
                {remarks.map(r => (
                  <div key={r.id} className="flex gap-3.5 items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                      r.author_role === 'mentor' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/40' : 'bg-teal-50 text-teal-750 border border-teal-100/40'
                    }`}>
                      {r.author_email?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{r.author_email}</span>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            r.author_role === 'mentor' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-650'
                          }`}>{r.author_role}</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{format(new Date(r.created_at), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50/40 rounded-2xl border border-dashed border-slate-200/60 mb-6">
                <MessageSquare size={24} className="text-slate-350 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-400">No remarks yet. Start the conversation!</p>
              </div>
            )}

            <div className="flex gap-2.5">
              <input value={remark} onChange={e => setRemark(e.target.value)}
                className="input flex-1 bg-white border-slate-200 shadow-inner" placeholder="Write a team remark or progress update…"
                onKeyDown={e => { if (e.key === 'Enter' && remark.trim() && !remarkMut.isPending) remarkMut.mutate({ project: id, content: remark }) }}
              />
              <button
                onClick={() => remark.trim() && remarkMut.mutate({ project: id, content: remark })}
                disabled={!remark.trim() || remarkMut.isPending}
                className="btn-primary px-5 py-2.5 shadow-md shadow-slate-900/10 flex items-center gap-2"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center border-dashed border-2 border-slate-200 bg-slate-50/30">
            <MessageSquare size={28} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 mb-4">Sign in to view remarks and team updates.</p>
            <Link to="/login" state={{ from: { pathname: `/projects/${id}` } }}
              className="btn-secondary text-xs gap-1.5 px-4 py-2 font-bold shadow-sm">
              <LogIn size={13} /> Sign in
            </Link>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)}
        title={existingProposal?.is_draft ? `Edit Draft Application: ${project.title}` : `Apply to: ${project.title}`} size="lg">
        <ProposalForm
          projectId={project.id}
          proposal={existingProposal?.is_draft ? existingProposal : null}
          onSubmit={d => proposalMut.mutate(d)}
          loading={proposalMut.isPending}
        />
      </Modal>
    </PageWrapper>
  )
}
