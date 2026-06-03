import { Calendar, BookOpen, Paperclip, Download, Phone, Mail, Hash, GraduationCap, Users } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function ProposalCard({ proposal, actions }) {
  const hasApplicantDetails =
    proposal.applicant_name || proposal.applicant_roll_no ||
    proposal.applicant_department || proposal.applicant_year

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100/90 rounded-[26px] p-6.5 flex flex-col gap-4.5 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:-translate-y-1">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900 text-[15px] leading-snug flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 flex-shrink-0">
                <BookOpen size={14} />
              </span>
              <span className="truncate">{proposal.project_title}</span>
            </p>
            {proposal.application_type === 'team' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 text-[9px] font-bold uppercase rounded-md">
                <Users size={10} /> Team Application
              </span>
            )}
          </div>
          {proposal.applicant_name ? (
            <p className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
              <span>{proposal.applicant_name}</span>
              {proposal.application_type === 'team' && (
                <span className="text-[9px] font-bold text-slate-400">(Team Lead)</span>
              )}
            </p>
          ) : proposal.student_email ? (
            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
              <span>{proposal.student_email}</span>
            </p>
          ) : null}
        </div>
        <div className="flex-shrink-0 pt-0.5">
          <Badge status={proposal.is_draft ? 'draft' : proposal.status} />
        </div>
      </div>

      {/* ── Applicant detail pills ──────────────────────────────────────── */}
      {hasApplicantDetails && (
        <div className="flex flex-wrap gap-1.5 relative z-10">
          {proposal.applicant_roll_no && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-150 text-slate-600 text-[10px] font-bold uppercase rounded-lg">
              <Hash size={10} /> {proposal.applicant_roll_no}
            </span>
          )}
          {proposal.applicant_department && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100/40 text-indigo-755 text-[10px] font-bold uppercase rounded-lg">
              <BookOpen size={10} /> {proposal.applicant_department}
            </span>
          )}
          {proposal.applicant_year && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100/40 text-emerald-755 text-[10px] font-bold uppercase rounded-lg">
              <GraduationCap size={10} /> {YEAR_LABELS[proposal.applicant_year] || `Year ${proposal.applicant_year}`}
            </span>
          )}
        </div>
      )}

      {/* ── Contact row ────────────────────────────────────────────────── */}
      {(proposal.applicant_email || proposal.applicant_contact) && (
        <div className="flex items-center gap-3.5 flex-wrap relative z-10 mt-0.5">
          {proposal.applicant_email && (
            <a
              href={`mailto:${proposal.applicant_email}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-650 hover:underline"
            >
              <Mail size={12} className="text-indigo-400" /> {proposal.applicant_email}
            </a>
          )}
          {proposal.applicant_contact && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-450">
              <Phone size={12} className="text-slate-350" /> {proposal.applicant_contact}
            </span>
          )}
        </div>
      )}

      {/* ── Cover message ───────────────────────────────────────────────── */}
      <p className="text-[13px] text-slate-650 leading-relaxed bg-slate-50/60 p-4.5 rounded-2xl border border-slate-100/50 italic relative z-10">
        "{proposal.message}"
      </p>

      {/* ── Team Section ────────────────────────────────────────────────── */}
      {proposal.application_type === 'team' && proposal.team && (
        <div className="border-t border-slate-100/80 pt-4.5 mt-0.5 relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-brand-600" />
              <span>Team Members ({proposal.team.name})</span>
            </p>
            <span className="text-[10px] font-extrabold text-brand-600 bg-brand-50 border border-brand-100/50 px-2 py-0.5 rounded-md">
              {1 + (proposal.team.members?.length || 0)} Members
            </span>
          </div>
          
          <div className="space-y-2">
            {/* Team Lead */}
            <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">{proposal.applicant_name || 'Team Lead'}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-600 text-white uppercase tracking-wide">
                    Lead
                  </span>
                </div>
                <p className="text-[9px] text-slate-450 mt-0.5">{proposal.applicant_roll_no} · {proposal.applicant_department}</p>
                <p className="text-[9px] text-slate-400">{proposal.applicant_email}</p>
              </div>
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                Linked
              </span>
            </div>
            
            {/* Other Members */}
            {proposal.team.members?.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50/30 p-3 rounded-xl border border-slate-100/40">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">{m.name || 'Unnamed Member'}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-brand-50 border border-brand-100 text-brand-700 uppercase tracking-wide">
                      {m.role_label || m.role}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-450 mt-0.5">{m.roll_number} · {m.department}</p>
                  <p className="text-[9px] text-slate-400">{m.email}</p>
                </div>
                <div>
                  {m.user ? (
                    <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                      Linked
                    </span>
                  ) : (
                    <span className="text-[8px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                      Awaiting Signup
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Attachment ──────────────────────────────────────────────────── */}
      {proposal.attachment_url && (
        <a
          href={proposal.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-650 bg-indigo-50 hover:bg-indigo-100/60 border border-indigo-100/40 px-3.5 py-2 rounded-xl transition-all w-fit relative z-10"
        >
          <Paperclip size={12} />
          <span>View attachment</span>
          <Download size={11} className="opacity-60" />
        </a>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 relative z-10 pt-1.5">
        <Calendar size={12} className="text-slate-350" />
        <span>Applied {format(new Date(proposal.created_at), 'MMM d, yyyy')}</span>
      </div>

      {actions && (
        <div className="border-t border-slate-100/80 pt-4 flex gap-2.5 flex-wrap relative z-10 mt-1">{actions}</div>
      )}
    </div>
  )
}
