import { describe, expect, it } from "vitest";
import type { UpdateInvitationInput } from "@/domain/invitation";
import {
  validateCreateInvitationInput,
  validateUpdateInvitationInput,
} from "@/features/invitations/invitationManagement.shared";

describe("invitation validation", () => {
  it("returns validation errors for an invalid create invitation input", () => {
    const errors = validateCreateInvitationInput({
      name: "",
      email: "invalid-email",
      locale: "",
      role: "clinician",
    });

    expect(errors).toEqual({
      name: "Name is required.",
      email: "Enter a valid email address.",
      locale: "Locale is required.",
    });
  });

  it("returns no validation errors for a valid create invitation input", () => {
    const errors = validateCreateInvitationInput({
      name: "Jane Doe",
      email: "jane@example.com",
      locale: "en-US",
      role: "clinician",
    });

    expect(errors).toEqual({});
  });

  it("returns validation errors for an invalid update invitation input", () => {
    const errors = validateUpdateInvitationInput({
      name: "",
      email: "",
      locale: "",
      role: "clinician",
      status: "invalid" as UpdateInvitationInput["status"],
    });

    expect(errors).toEqual({
      name: "Name is required.",
      email: "Email is required.",
      locale: "Locale is required.",
      status: "Choose a valid status.",
    });
  });

  it("returns no validation errors for a valid update invitation input", () => {
    const errors = validateUpdateInvitationInput({
      name: "Jane Doe",
      email: "jane@example.com",
      locale: "en-US",
      role: "coordinator",
      status: "accepted",
    });

    expect(errors).toEqual({});
  });
});
