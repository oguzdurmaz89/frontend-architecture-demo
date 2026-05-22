import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CreateInvitationInput,
  UpdateInvitationInput,
} from "@/domain/invitation";

const REQUEST_DELAY_MS = 400;

const resolveRequest = async <T>(request: Promise<T>): Promise<T> => {
  await vi.advanceTimersByTimeAsync(REQUEST_DELAY_MS);

  return request;
};

const expectRequestToReject = async <T>(
  requestFactory: () => Promise<T>,
  expectedError: object,
): Promise<void> => {
  const request = requestFactory();
  const assertion = expect(request).rejects.toMatchObject(expectedError);

  await vi.advanceTimersByTimeAsync(REQUEST_DELAY_MS);
  await assertion;
};

const createInput = (email: string): CreateInvitationInput => {
  return {
    name: "Jane Doe",
    email,
    locale: "en-US",
    role: "clinician",
  };
};

const updateInput = (email: string): UpdateInvitationInput => {
  return {
    name: "Jane Updated",
    email,
    locale: "da-DK",
    role: "coordinator",
    status: "accepted",
  };
};

describe("invitationService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates an invitation with normalized email and pending status", async () => {
    const { createInvitation } = await import("@/api/invitationService");

    const createdInvitation = await resolveRequest(
      createInvitation(createInput("  JANE@example.com  ")),
    );

    expect(createdInvitation).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      locale: "en-US",
      role: "clinician",
      status: "pending",
    });

    expect(createdInvitation.id).toEqual(expect.any(String));
    expect(createdInvitation.createdAt).toEqual(expect.any(String));
  });

  it("rejects duplicate email addresses when creating an invitation", async () => {
    const { createInvitation } = await import("@/api/invitationService");

    await resolveRequest(
      createInvitation(createInput("duplicate@example.com")),
    );

    await expectRequestToReject(
      () => createInvitation(createInput(" DUPLICATE@example.com ")),
      {
        code: "DUPLICATE_EMAIL",
        statusCode: 409,
      },
    );
  });

  it("updates an existing invitation", async () => {
    const { createInvitation, updateInvitation } =
      await import("@/api/invitationService");

    const createdInvitation = await resolveRequest(
      createInvitation(createInput("update@example.com")),
    );

    const updatedInvitation = await resolveRequest(
      updateInvitation(
        createdInvitation.id,
        updateInput("updated@example.com"),
      ),
    );

    expect(updatedInvitation).toMatchObject({
      id: createdInvitation.id,
      name: "Jane Updated",
      email: "updated@example.com",
      locale: "da-DK",
      role: "coordinator",
      status: "accepted",
      createdAt: createdInvitation.createdAt,
    });
  });

  it("rejects update when another invitation already uses the email", async () => {
    const { createInvitation, updateInvitation } =
      await import("@/api/invitationService");

    const firstInvitation = await resolveRequest(
      createInvitation(createInput("first@example.com")),
    );

    const secondInvitation = await resolveRequest(
      createInvitation(createInput("second@example.com")),
    );

    await expectRequestToReject(
      () =>
        updateInvitation(
          secondInvitation.id,
          updateInput(firstInvitation.email),
        ),
      {
        code: "DUPLICATE_EMAIL",
        statusCode: 409,
      },
    );
  });

  it("rejects update when the invitation does not exist", async () => {
    const { updateInvitation } = await import("@/api/invitationService");

    await expectRequestToReject(
      () =>
        updateInvitation(
          "missing-invitation-id",
          updateInput("missing@example.com"),
        ),
      {
        code: "INVITATION_NOT_FOUND",
        statusCode: 404,
      },
    );
  });

  it("deletes an existing invitation", async () => {
    const { createInvitation, deleteInvitation, fetchInvitations } =
      await import("@/api/invitationService");

    const createdInvitation = await resolveRequest(
      createInvitation(createInput("delete@example.com")),
    );

    const deletedInvitationId = await resolveRequest(
      deleteInvitation(createdInvitation.id),
    );

    expect(deletedInvitationId).toBe(createdInvitation.id);

    const invitations = await resolveRequest(fetchInvitations());

    expect(
      invitations.some((invitation) => invitation.id === createdInvitation.id),
    ).toBe(false);
  });

  it("rejects delete when the invitation does not exist", async () => {
    const { deleteInvitation } = await import("@/api/invitationService");

    await expectRequestToReject(
      () => deleteInvitation("missing-invitation-id"),
      {
        code: "INVITATION_NOT_FOUND",
        statusCode: 404,
      },
    );
  });
});
