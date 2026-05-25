from django.dispatch import Signal

# Emitted when a proposal is submitted or finalized from draft
# Args: proposal (Proposal instance)
proposal_submitted = Signal()

# Emitted when status updates to accepted or rejected
# Args: proposal (Proposal instance), old_status (str), new_status (str)
proposal_status_changed = Signal()

# Emitted when an account is linked to a team member
# Args: user (User instance), team_member (TeamMember instance)
team_member_linked = Signal()
