import { USER_ROLES, type UserRole } from "@/auth/accessControl";

type RoleSwitcherProps = {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  viewer: "Viewer",
};

const getRoleButtonClassName = (isSelected: boolean): string => {
  return [
    "rounded-xl px-4 py-2 text-sm font-semibold transition",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    isSelected
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-500 hover:bg-white hover:text-slate-900",
  ].join(" ");
};

export const RoleSwitcher = ({ role, onRoleChange }: RoleSwitcherProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-6">
      <div
        role="group"
        aria-label="Select demo role"
        className="inline-flex w-fit rounded-2xl border border-slate-200 bg-slate-100 p-1"
      >
        {USER_ROLES.map((option) => {
          const isSelected = option === role;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onRoleChange(option)}
              className={getRoleButtonClassName(isSelected)}
            >
              {ROLE_LABELS[option]}
            </button>
          );
        })}
      </div>
    </section>
  );
};
