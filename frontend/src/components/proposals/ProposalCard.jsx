import { Calendar, BookOpen, Paperclip, Download } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

export default function ProposalCard({ proposal, actions }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-snug flex items-center gap-1.5">
            <BookOpen size={14} className="text-brand-400 flex-shrink-0" />
            {proposal.project_title}
          </p>
          {proposal.student_email && (
            <p className="text-xs text-gray-400 mt-0.5">{proposal.student_email}</p>
          )}
        </div>
        <Badge status={proposal.status} />
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
        "{proposal.message}"
      </p>

      {/* Attachment download */}
      {proposal.attachment_url && (
        <a
          href={proposal.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 text-xs font-medium text-brand-600
                     hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200
                     px-3 py-1.5 rounded-lg transition-colors w-fit"
        >
          <Paperclip size={12} />
          View attachment
          <Download size={11} className="opacity-60" />
        </a>
      )}

      {/* Footer */}
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