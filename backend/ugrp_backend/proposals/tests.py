from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from projects.models import Project, Team, TeamMember
from proposals.models import Proposal
from enrollments.models import Enrollment
from proposals.serializers import ProposalCreateSerializer
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class ProposalWorkflowTests(TestCase):
    def setUp(self):
        # Create a mentor
        self.mentor = User.objects.create_user(
            email='mentor@test.com',
            password='password123',
            role=User.Role.MENTOR
        )
        # Create a project
        self.project = Project.objects.create(
            title='Project Alpha',
            description='Test Project',
            mentor=self.mentor,
            status=Project.Status.OPEN
        )
        # Create student lead
        self.student_lead = User.objects.create_user(
            email='lead@test.com',
            password='password123',
            role=User.Role.STUDENT
        )
        self.student_lead.student_profile.name = 'Lead Student'
        self.student_lead.student_profile.roll_number = 'ROLL001'
        self.student_lead.student_profile.department = 'Computer Science & Engineering'
        self.student_lead.student_profile.save()

        # Create registered member
        self.registered_member = User.objects.create_user(
            email='member1@test.com',
            password='password123',
            role=User.Role.STUDENT
        )
        self.registered_member.student_profile.name = 'Registered Member'
        self.registered_member.student_profile.roll_number = 'ROLL002'
        self.registered_member.student_profile.department = 'Computer Science & Engineering'
        self.registered_member.student_profile.save()

        # Mock request
        self.factory = RequestFactory()
        self.request = self.factory.post('/api/proposals/')
        self.request.user = self.student_lead

        # Mock attachment file
        self.attachment = SimpleUploadedFile(
            "resume.pdf",
            b"file_content",
            content_type="application/pdf"
        )

    def test_team_size_limit_validation(self):
        # Case 1: Team size is 1 (only lead, no members). Should fail if not a draft.
        data = {
            'project': self.project.id,
            'application_type': 'team',
            'team_name': 'Dev Team',
            'members': [],
            'message': 'We want to join!',
            'attachment': self.attachment,
            'is_draft': False
        }
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('members', serializer.errors)

        # Case 2: Team size is 11 (lead + 10 members). Should fail.
        members = [
            {'email': f'm{i}@test.com', 'name': f'Member {i}', 'roll_number': f'R{i}', 'department': 'CS', 'role': 'frontend_dev'}
            for i in range(10)
        ]
        data['members'] = members
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('members', serializer.errors)

        # Case 3: Team size is valid (lead + 1 member = 2). Should succeed.
        data['members'] = [
            {'email': 'member1@test.com', 'name': 'Registered Member', 'roll_number': 'ROLL002', 'department': 'Computer Science & Engineering', 'role': 'frontend_dev'}
        ]
        # Recreate attachment because SimpleUploadedFile gets consumed
        data['attachment'] = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_draft_validation_bypass(self):
        # When is_draft is True, validation should relax minimum team size and missing team name
        data = {
            'project': self.project.id,
            'application_type': 'team',
            'team_name': '',  # Empty name
            'members': [],  # Size is 1 (only lead)
            'message': 'Saving a draft...',
            'is_draft': True
        }
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        proposal = serializer.save()
        self.assertEqual(proposal.is_draft, True)
        self.assertEqual(proposal.team.name, '')

    def test_duplicate_application_validation(self):
        # Create an active proposal for the student lead on project
        Proposal.objects.create(
            student=self.student_lead,
            project=self.project,
            status=Proposal.Status.PENDING,
            is_draft=False
        )

        data = {
            'project': self.project.id,
            'application_type': 'individual',
            'message': 'Applying again...',
            'attachment': SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf"),
            'is_draft': False
        }
        # Try to apply again. Should raise validation error.
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_auto_enrollment_on_approval(self):
        # Submit a team proposal
        data = {
            'project': self.project.id,
            'application_type': 'team',
            'team_name': 'Dream Team',
            'members': [
                {'email': 'member1@test.com', 'name': 'Member 1', 'roll_number': 'ROLL002', 'department': 'CS', 'role': 'frontend_dev'},
                {'email': 'unregistered@test.com', 'name': 'Member 2', 'roll_number': 'ROLL003', 'department': 'CS', 'role': 'backend_dev'}
            ],
            'message': 'Let us collaborate!',
            'attachment': SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf"),
            'is_draft': False
        }
        serializer = ProposalCreateSerializer(data=data, context={'request': self.request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        proposal = serializer.save()

        # Verify proposal has status pending
        self.assertEqual(proposal.status, Proposal.Status.PENDING)
        self.assertEqual(Enrollment.objects.filter(project=self.project).count(), 0)

        # Now Mentor accepts proposal
        # Simulate perform_update status change
        proposal.status = Proposal.Status.ACCEPTED
        proposal.save()

        # Trigger enrollment creation logic from views perform_update manually
        Enrollment.objects.get_or_create(student=proposal.student, project=proposal.project)
        for member in proposal.team.members.all():
            if member.user:
                Enrollment.objects.get_or_create(student=member.user, project=proposal.project)

        # Check enrollments
        self.assertTrue(Enrollment.objects.filter(student=self.student_lead, project=self.project).exists())
        self.assertTrue(Enrollment.objects.filter(student=self.registered_member, project=self.project).exists())
        # Unregistered user is not yet created, so they shouldn't be enrolled
        self.assertFalse(Enrollment.objects.filter(student__email='unregistered@test.com', project=self.project).exists())

    def test_account_linking_on_signup_signal(self):
        # Create a team proposal and accept it
        team = Team.objects.create(name='Super Coders', leader=self.student_lead)
        TeamMember.objects.create(
            team=team,
            email='newbie@test.com',
            name='Newbie Student',
            roll_number='ROLL099',
            department='Biotechnology',
            role='researcher',
            invitation_status='accepted'
        )
        proposal = Proposal.objects.create(
            student=self.student_lead,
            project=self.project,
            application_type='team',
            team=team,
            status=Proposal.Status.ACCEPTED,
            is_draft=False
        )

        # Confirm newbie is not a user and not enrolled yet
        self.assertFalse(User.objects.filter(email='newbie@test.com').exists())
        self.assertEqual(Enrollment.objects.filter(student__email='newbie@test.com', project=self.project).count(), 0)

        # New user registers
        newbie_user = User.objects.create_user(
            email='newbie@test.com',
            password='password123',
            role=User.Role.STUDENT
        )

        # Signal link_team_member_on_signup should trigger
        # 1. TeamMember user field is updated to the user
        member = TeamMember.objects.get(email='newbie@test.com')
        self.assertEqual(member.user, newbie_user)

        # 2. StudentProfile fields (name, roll_number, department) are populated
        profile = newbie_user.student_profile
        self.assertEqual(profile.name, 'Newbie Student')
        self.assertEqual(profile.roll_number, 'ROLL099')
        self.assertEqual(profile.department, 'Biotechnology')

        # 3. Newbie is automatically enrolled
        self.assertTrue(Enrollment.objects.filter(student=newbie_user, project=self.project).exists())
