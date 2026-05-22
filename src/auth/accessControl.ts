export const USER_ROLES = ["admin", "viewer"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const canManageInvitations = (role: UserRole): boolean => {
    return role === "admin";
};