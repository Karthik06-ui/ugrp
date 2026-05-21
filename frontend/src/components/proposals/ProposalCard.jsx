import { Calendar, BookOpen, Paperclip, Download, Phone, Mail, Hash, GraduationCap } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

const YEAR_LABELS = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' }

export default function ProposalCard({ proposal, actions }) {
  const hasApplicantDetails =
    proposal.applicant_name || proposal.applicant_roll_no ||
    proposal.applicant_department || proposal.applicant_year

  return (
    <div className="card p-5 flex flex-col gap-3">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-snug flex items-center gap-1.5">
            <BookOpen size={14} className="text-brand-400 flex-shrink-0" />
            {proposal.project_title}
          </p>
          {proposal.applicant_name ? (
            <p className="text-xs font-medium text-gray-700 mt-0.5">{proposal.applicant_name}</p>
          ) : proposal.student_email ? (
            <p className="text-xs text-gray-400 mt-0.5">{proposal.student_email}</p>
          ) : null}
        </div>
        <Badge status={proposal.status} />
      </div>

      {/* ── Applicant detail pills ──────────────────────────────────────── */}
      {hasApplicantDetails && (
        <div className="flex flex-wrap gap-1.5">
          {proposal.applicant_roll_no && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
              <Hash size={10} /> {proposal.applicant_roll_no}
            </span>
          )}
          {proposal.applicant_department && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-md">
              <BookOpen size={10} /> {proposal.applicant_department}
            </span>
          )}
          {proposal.applicant_year && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-md">
              <GraduationCap size={10} /> {YEAR_LABELS[proposal.applicant_year] || `Year ${proposal.applicant_year}`}
            </span>
          )}
        </div>
      )}

      {/* ── Contact row ────────────────────────────────────────────────── */}
      {(proposal.applicant_email || proposal.applicant_contact) && (
        <div className="flex items-center gap-3 flex-wrap">
          {proposal.applicant_email && (
            <a
              href={`mailto:${proposal.applicant_email}`}
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
            >
              <Mail size={11} /> {proposal.applicant_email}
            </a>
          )}
          {proposal.applicant_contact && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Phone size={11} /> {proposal.applicant_contact}
            </span>
          )}
        </div>
      )}

      {/* ── Cover message ───────────────────────────────────────────────── */}
      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
        "{proposal.message}"
      </p>

      {/* ── Attachment ──────────────────────────────────────────────────── */}
      {proposal.attachment_url && (
        <a
          href={proposal.attachment_url}
          target="_blank" rel="noopener noreferrer" download
          className="inline-flex items-center gap-2 text-xs font-medium text-brand-600
                     hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200
                     px-3 py-1.5 rounded-lg transition-colors w-fit"
        >
          <Paperclip size={12} /> View attachment <Download size={11} className="opacity-60" />
        </a>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={11} />
        Applied {format(new Date(proposal.created_at), 'MMM d, yyyy')}
      </div>

      {actions && (
        <div className="border-t border-gray-100 pt-3 flex gap-2 flex-wrap">{actions}</div>
      )}
    </div>
  )
}