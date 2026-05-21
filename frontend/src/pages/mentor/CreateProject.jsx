import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { createProject } from '../../api/projects'
import ProjectForm from '../../components/projects/ProjectForm'
import PageWrapper from '../../components/layout/PageWrapper'
import toast from 'react-hot-toast'

export default function CreateProject() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const mut = useMutation({
    mutationFn: createProject,
    onSuccess: (res) => {
      toast.success('Project created!')
      qc.invalidateQueries(['projects'])
      qc.invalidateQueries(['mentor-dashboard'])
      navigate(`/projects/${res.data.id}`)
    },
    onError: e => {
      const errors = e.response?.data
      const first  = errors && Object.values(errors).flat()[0]
      toast.error(first || 'Could not create project')
    },
  })

  return (
    <PageWrapper title="Create new project" subtitle="Post a research opportunity for students to apply to">
      <div className="max-w-xl">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="card p-6">
          <ProjectForm
            onSubmit={d => mut.mutate(d)}
            loading={mut.isPending}
          />
        </div>
      </div>
    </PageWrapper>
  )
}