import { canManageInvitations, type UserRole } from "@/auth/accessControl";

export type InvitationManagementAccessResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: {
        code: "FORBIDDEN";
        message: string;
      };
    };

export const guardInvitationManagementAccess = (
  role: UserRole,
): InvitationManagementAccessResult => {
  if (!canManageInvitations(role)) {
    return {
      ok: false,
      error: {
        code: "FORBIDDEN",
        message: "Only admins can manage invitations.",
      },
    };
  }

  return {
    ok: true,
  };
};
