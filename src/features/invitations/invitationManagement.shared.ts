import type {
  CreateInvitationInput,
  Invitation,
  InvitationRole,
  InvitationStatus,
  UpdateInvitationInput,
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
  UpdateInvitationInput,
  StatusFilter,
};

export const INVITATION_ROLES: InvitationRole[] = [
  "admin",
  "clinician",
  "coordinator",
];

export const INVITATION_STATUSES: InvitationStatus[] = [
  "pending",
  "accepted",
  "expired",
  "revoked",
];

const ROLE_LABELS: Record<InvitationRole, string> = {
  admin: "Admin",
  clinician: "Clinician",
  coordinator: "Coordinator",
};

const STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
  revoked: "Revoked",
};

export const ROLE_SELECT_OPTIONS: SelectOption<InvitationRole>[] =
  INVITATION_ROLES.map((role) => ({
    label: ROLE_LABELS[role],
    value: role,
  }));

export const STATUS_SELECT_OPTIONS: SelectOption<InvitationStatus>[] =
  INVITATION_STATUSES.map((status) => ({
    label: STATUS_LABELS[status],
    value: status,
  }));

export const STATUS_FILTER_SELECT_OPTIONS: SelectOption<StatusFilter>[] = [
  {
    label: "All statuses",
    value: "all",
  },
  ...INVITATION_STATUSES.map((status): SelectOption<StatusFilter> => {
    return {
      label: STATUS_LABELS[status],
      value: status,
    };
  }),
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

type InvitationDetailsInput = Pick<
  UpdateInvitationInput,
  "name" | "email" | "locale" | "role"
>;

type InvitationFormErrors<TInput> = Partial<Record<keyof TInput, string>>;

export type FormErrors = InvitationFormErrors<CreateInvitationInput>;

export type UpdateInvitationFormErrors =
  InvitationFormErrors<UpdateInvitationInput>;

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
  canManageInvitations: boolean;
};

export type InvitationsTableProps = {
  invitations: Invitation[];
  canManageInvitations: boolean;
  onEditInvitation: (invitation: Invitation) => void;
  onDeleteInvitation: (invitation: Invitation) => void;
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

const validateInvitationDetails = (
  input: InvitationDetailsInput,
): InvitationFormErrors<InvitationDetailsInput> => {
  const errors: InvitationFormErrors<InvitationDetailsInput> = {};

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

export const validateCreateInvitationInput = (
  input: CreateInvitationInput,
): FormErrors => {
  return validateInvitationDetails(input);
};

export const validateUpdateInvitationInput = (
  input: UpdateInvitationInput,
): UpdateInvitationFormErrors => {
  const errors: UpdateInvitationFormErrors = {
    ...validateInvitationDetails(input),
  };

  if (!INVITATION_STATUSES.includes(input.status)) {
    errors.status = "Choose a valid status.";
  }

  return errors;
};

export const formatCreatedDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};
