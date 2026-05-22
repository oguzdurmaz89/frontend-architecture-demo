export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";
export type InvitationRole = "admin" | "clinician" | "coordinator";

export type Invitation = {
  id: string;
  name: string;
  email: string;
  locale: string;
  role: InvitationRole;
  status: InvitationStatus;
  createdAt: string;
};

export type CreateInvitationInput = {
  name: string;
  email: string;
  locale: string;
  role: InvitationRole;
};

export type UpdateInvitationInput = {
  name: string;
  email: string;
  locale: string;
  role: InvitationRole;
  status: InvitationStatus;
};
