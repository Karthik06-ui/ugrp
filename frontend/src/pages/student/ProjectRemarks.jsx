import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Trash2, Send, Filter } from 'lucide-react'
import { listRemarks, createRemark, deleteRemark } from '../../api/dashboard'
import { getMyEnrollments } from '../../api/enrollments'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ProjectRemarks() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [selectedProject, setSelectedProject] = useState('')
  const [content, setContent] = useState('')

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getMyEnrollments().then(r => r.data),
  })

  const { data: remarks = [], isLoading } = useQuery({
    queryKey: ['remarks', selectedProject],
    queryFn: () => listRemarks(selectedProject ? { project: selectedProject } : {}).then(r => r.data),
  })

  const addMut = useMutation({
    mutationFn: createRemark,
    onSuccess: () => {
      toast.success('Remark posted')
      setContent('')
      qc.invalidateQueries(['remarks'])
    },
    onError: e => toast.error(e.response?.data?.detail || 'Could not post remark'),
  })

  const delMut = useMutation({
    mutationFn: deleteRemark,
    onSuccess: () => {
      toast.success('Remark deleted')
      qc.invalidateQueries(['remarks'])
    },
    onError: () => toast.error('Could not delete remark'),
  })

  return (
    <PageWrapper title="Project remarks" subtitle="Progress notes and updates from your project teams">
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        {/* Project filter dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 flex-shrink-0">
            <Filter size={15} />
          </div>
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="bg-white border border-slate-150 text-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-[0_2px_8px_rgba(15,23,42,0.015)] transition-all max-w-xs"
          >
            <option value="">All enrolled projects</option>
            {enrollments.map(e => (
              <option key={e.project} value={e.project}>{e.project_title}</option>
            ))}
          </select>
        </div>

        {/* Post remark card */}
        <div className="group relative overflow-hidden rounded-[26px] bg-white border border-slate-100/80 p-6 shadow-[0_8px_30px_rgb(15,23,42,0.015)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 relative z-10">Post a remark</label>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end relative z-10">
            <div className="flex-1 space-y-3">
              {!selectedProject && enrollments.length > 1 && (
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                >
                  <option value="">Select project for this remark…</option>
                  {enrollments.map(e => (
                    <option key={e.project} value={e.project}>{e.project_title}</option>
                  ))}
                </select>
              )}
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full min-h-[90px] p-4.5 bg-slate-50 border border-slate-150 focus:border-indigo-400 focus:bg-white rounded-2xl text-xs font-medium text-slate-750 placeholder-slate-400 outline-none resize-none transition-all"
                placeholder="Share a progress update, milestone, or question with your team…"
              />
            </div>
            <button
              onClick={() => {
                const proj = selectedProject || (enrollments.length === 1 ? String(enrollments[0].project) : '')
                if (!proj) {
                  toast.error('Select a project first')
                  return
                }
                if (!content.trim()) return
                addMut.mutate({ project: proj, content })
              }}
              disabled={!content.trim() || addMut.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-xs font-bold text-white transition-all duration-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed h-fit self-end sm:mb-0"
            >
              <Send size={12} />
              <span>Post</span>
            </button>
          </div>
        </div>

        {/* Remarks Feed */}
        {isLoading ? (
          <PageSpinner />
        ) : remarks.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No remarks yet" description="Be the first to post a progress note on this project." />
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remarks Activity</h3>
            <div className="space-y-4">
              {remarks.map(r => {
                const isMentor = r.author_role === 'mentor'
                return (
                  <div key={r.id} className="group relative overflow-hidden rounded-[24px] bg-white border border-slate-100/80 p-5.5 flex gap-4 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.03)] hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-extrabold relative z-10 border ${
                      isMentor
                        ? 'bg-rose-50 border-rose-100/50 text-rose-600'
                        : 'bg-indigo-50 border-indigo-100/50 text-indigo-600'
                    }`}>
                      {r.author_email?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">{r.author_email}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
                          isMentor
                            ? 'bg-rose-50 text-rose-750 border-rose-100/40'
                            : 'bg-indigo-50 text-indigo-750 border-indigo-100/40'
                        }`}>
                          {r.author_role}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                          {r.project_title}
                        </span>
                        <span className="text-slate-205 text-[10px]">·</span>
                        <span className="text-[10px] font-semibold text-slate-400">{format(new Date(r.created_at), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-[13px] text-slate-650 leading-relaxed font-medium mt-1">{r.content}</p>
                    </div>

                    {r.author === user?.user_id && (
                      <button
                        onClick={() => delMut.mutate(r.id)}
                        className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all self-start mt-0.5 flex-shrink-0 relative z-10"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}