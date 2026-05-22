import type { CreateInvitationInput, Invitation } from "@/domain/invitation";
import { ApiError } from "@/api/errors";
import { mockInvitations } from "@/api/mockInvitations";

let invitations: Invitation[] = [...mockInvitations];

const REQUEST_DELAY_MS = 400;

// Adds a fake delay to mimic an API request.
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
};

// Generates a unique ID for a new invitation.
const createInvitationId = (): string => {
  return crypto.randomUUID();
};

// Normalizes email values before storing or comparing them.
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Checks if an email already exists in the invitations list, ignoring case and whitespace.
const isEmailAlreadyExists = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);
  return invitations.some(
    (invitation) => normalizeEmail(invitation.email) === normalizedEmail,
  );
};

// Sorts invitations from newest to oldest.
const sortByDate = (a: Invitation, b: Invitation): number => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

// Fetches invitations from the mock data source.
export const fetchInvitations = async (): Promise<Invitation[]> => {
  await wait(REQUEST_DELAY_MS);
  return [...invitations].sort(sortByDate);
};

// Creates a new invitation and adds it to the mock data source.
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<Invitation> {
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
    locale: input.locale,
    role: input.role,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  invitations = [...invitations, invitation];
  return invitation;
}
