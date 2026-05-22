import type { CreateInvitationInput, Invitation, UpdateInvitationInput } from "@/domain/invitation";
import { ApiError } from "@/api/errors";
import { mockInvitations } from "@/api/mockInvitations";

let invitations: Invitation[] = [...mockInvitations];

const REQUEST_DELAY_MS = 400;

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
};

const createInvitationId = (): string => {
  return crypto.randomUUID();
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const isEmailAlreadyExists = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);

  return invitations.some(
    (invitation) => normalizeEmail(invitation.email) === normalizedEmail,
  );
};

const isEmailUsedByAnotherInvitation = (
  email: string,
  invitationId: string,
): boolean => {
  const normalizedEmail = normalizeEmail(email);

  return invitations.some(
    (invitation) =>
      invitation.id !== invitationId &&
      normalizeEmail(invitation.email) === normalizedEmail,
  );
};

const sortByDate = (a: Invitation, b: Invitation): number => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const findInvitationIndex = (invitationId: string): number => {
  return invitations.findIndex((invitation) => invitation.id === invitationId);
};

export const fetchInvitations = async (): Promise<Invitation[]> => {
  await wait(REQUEST_DELAY_MS);

  return [...invitations].sort(sortByDate);
};

export const createInvitation = async (
  input: CreateInvitationInput,
): Promise<Invitation> => {
  await wait(REQUEST_DELAY_MS);

  if (isEmailAlreadyExists(input.email)) {
    throw new ApiError({
      code: "DUPLICATE_EMAIL",
      message: "An invitation with this email already exists.",
      statusCode: 409,
      context: { email: input.email },
    });
  }

  const invitation: Invitation = {
    id: createInvitationId(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    locale: input.locale.trim(),
    role: input.role,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  invitations = [...invitations, invitation];

  return invitation;
};

export const updateInvitation = async (
  invitationId: string,
  input: UpdateInvitationInput,
): Promise<Invitation> => {
  await wait(REQUEST_DELAY_MS);

  const invitationIndex = findInvitationIndex(invitationId);

  if (invitationIndex === -1) {
    throw new ApiError({
      code: "INVITATION_NOT_FOUND",
      message: "The invitation could not be found.",
      statusCode: 404,
      context: { invitationId },
    });
  }

  if (isEmailUsedByAnotherInvitation(input.email, invitationId)) {
    throw new ApiError({
      code: "DUPLICATE_EMAIL",
      message: "An invitation with this email already exists.",
      statusCode: 409,
      context: { email: input.email },
    });
  }

  const currentInvitation = invitations[invitationIndex];

  const updatedInvitation: Invitation = {
    ...currentInvitation,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    locale: input.locale.trim(),
    role: input.role,
    status: input.status,
  };

  invitations = invitations.map((invitation) =>
    invitation.id === invitationId ? updatedInvitation : invitation,
  );

  return updatedInvitation;
};

export const deleteInvitation = async (
  invitationId: string,
): Promise<string> => {
  await wait(REQUEST_DELAY_MS);

  const invitationIndex = findInvitationIndex(invitationId);

  if (invitationIndex === -1) {
    throw new ApiError({
      code: "INVITATION_NOT_FOUND",
      message: "The invitation could not be found.",
      statusCode: 404,
      context: { invitationId },
    });
  }

  invitations = invitations.filter(
    (invitation) => invitation.id !== invitationId,
  );

  return invitationId;
};
