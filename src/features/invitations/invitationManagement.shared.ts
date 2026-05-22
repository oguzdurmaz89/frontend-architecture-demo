import type {
  CreateInvitationInput,
  Invitation,
  InvitationRole,
  InvitationStatus,
} from "@/domain/invitation";

import type { BadgeTone, SelectOption } from "@/components/ui";

import type {
  StatusFilter,
  useInvitationList,
} from "@/features/invitations/hooks/useInvitationListState";

export type {
  CreateInvitationInput,
  Invitation,
  InvitationRole,
  InvitationStatus,
  StatusFilter,
};

export const INVITATION_ROLES: InvitationRole[] = [
  "admin",
  "clinician",
  "coordinator",
];

export const ROLE_SELECT_OPTIONS: SelectOption<InvitationRole>[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Clinician",
    value: "clinician",
  },
  {
    label: "Coordinator",
    value: "coordinator",
  },
];

export const STATUS_FILTER_SELECT_OPTIONS: SelectOption<StatusFilter>[] = [
  {
    label: "All statuses",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Expired",
    value: "expired",
  },
  {
    label: "Revoked",
    value: "revoked",
  },
];

export const INITIAL_FORM_VALUES: CreateInvitationInput = {
  name: "",
  email: "",
  locale: "en-US",
  role: "clinician",
};

export const STATUS_BADGE_TONES: Record<InvitationStatus, BadgeTone> = {
  pending: "warning",
  accepted: "success",
  expired: "neutral",
  revoked: "danger",
};

export type FormErrors = Partial<Record<keyof CreateInvitationInput, string>>;

export type InvitationListState = ReturnType<typeof useInvitationList>;

export type CreateInvitationFormProps = {
  onInvitationCreated: (invitation: Invitation) => void;
};

export type InvitationFiltersProps = {
  searchQuery: string;
  statusFilter: StatusFilter;
  onSearchQueryChange: (searchQuery: string) => void;
  onStatusFilterChange: (statusFilter: StatusFilter) => void;
  onRefresh: () => Promise<void>;
};

export type InvitationListSectionProps = {
  invitationList: InvitationListState;
};

export type InvitationsTableProps = {
  invitations: Invitation[];
};

export type StatusBadgeProps = {
  status: InvitationStatus;
};

export type InvitationPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export const validateCreateInvitationInput = (
  input: CreateInvitationInput,
): FormErrors => {
  const errors: FormErrors = {};

  if (input.name.trim().length === 0) {
    errors.name = "Name is required.";
  }

  if (input.email.trim().length === 0) {
    errors.email = "Email is required.";
  } else if (!input.email.includes("@")) {
    errors.email = "Enter a valid email address.";
  }

  if (input.locale.trim().length === 0) {
    errors.locale = "Locale is required.";
  }

  if (!INVITATION_ROLES.includes(input.role)) {
    errors.role = "Choose a valid role.";
  }

  return errors;
};

export const formatCreatedDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};
