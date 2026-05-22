export type UserRole = "admin" | "viewer";

export const USER_ROLES: UserRole[] = ["admin", "viewer"];

export const canManageInvitations = (role: UserRole): boolean => {
  return role === "admin";
};
