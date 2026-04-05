import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Save } from 'lucide-react'
import { getStudentProfile, updateStudentProfile, getMentorProfile, updateMentorProfile } from '../../api/profiles'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const YEARS = [1, 2, 3, 4]
const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Researcher']

export default function ProfilePage() {
  const { isStudent, isMentor, user } = useAuth()
  const qc = useQueryClient()
  const [form, setForm] = useState({})

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.role],
    queryFn: () => (isStudent ? getStudentProfile() : getMentorProfile()).then(r => r.data),
    enabled: !!user,
  })

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  const mut = useMutation({
    mutationFn: (d) => isStudent ? updateStudentProfile(d) : updateMentorProfile(d),
    onSuccess: () => { toast.success('Profile updated'); qc.invalidateQueries(['profile']) },
    onError: e => {
      const errors = e.response?.data
      const first  = errors && Object.values(errors).flat()[0]
      toast.error(first || 'Could not update profile')
    },
  })

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }
  function handleSkills(e) {
    setForm(f => ({ ...f, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))
  }

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper title="My profile" subtitle="Update your personal and academic information">
      <div className="max-w-xl">
        <div className="card p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{form.name || user?.email}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={e => { e.preventDefault(); mut.mutate(form) }} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input name="name" value={form.name || ''} onChange={handle} className="input" placeholder="Dr. Jane Smith" />
            </div>

            {isStudent && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Roll number</label>
                    <input name="roll_number" value={form.roll_number || ''} onChange={handle} className="input" placeholder="CS2024001" />
                  </div>
                  <div>
                    <label className="label">Year</label>
                    <select name="year" value={form.year || ''} onChange={handle} className="input">
                      <option value="">Select year</option>
                      {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Department</label>
                  <input name="department" value={form.department || ''} onChange={handle} className="input" placeholder="Computer Science" />
                </div>
                <div>
                  <label className="label">Skills <span className="text-gray-400 normal-case font-normal">(comma-separated)</span></label>
                  <input name="skills" value={Array.isArray(form.skills) ? form.skills.join(', ') : ''} onChange={handleSkills}
                    className="input" placeholder="Python, Machine Learning, Django" />
                  {Array.isArray(form.skills) && form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.skills.map(s => (
                        <span key={s} className="inline-flex items-center px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-md border border-brand-200">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {isMentor && (
              <>
                <div>
                  <label className="label">Department</label>
                  <input name="department" value={form.department || ''} onChange={handle} className="input" placeholder="Computer Science" />
                </div>
                <div>
                  <label className="label">Designation</label>
                  <select name="designation" value={form.designation || ''} onChange={handle} className="input">
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="label">Bio <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
              <textarea name="bio" value={form.bio || ''} onChange={handle}
                className="input min-h-[100px] resize-y" placeholder="A short bio about yourself…" />
            </div>

            <button type="submit" disabled={mut.isPending} className="btn-primary gap-2">
              <Save size={14} />
              {mut.isPending ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}