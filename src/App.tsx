import { useState } from "react";
import { type UserRole } from "@/auth/accessControl";
import { guardInvitationManagementAccess } from "@/boundaries/guardInvitationManagementAccess";
import { InvitationManagementPage } from "@/features/invitations/components/InvitationManagementPage";
import { InvitationAccessDenied } from "@/features/invitations/components/InvitationAccessDenied";
import { RoleSwitcher } from "@/features/invitations/components/RoleSwitcher";

function App() {
  const [role, setRole] = useState<UserRole>("admin");

  const access = guardInvitationManagementAccess(role);

  const handleRoleChange = (selectedRole: UserRole): void => {
    setRole(selectedRole);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <RoleSwitcher role={role} onRoleChange={handleRoleChange} />

      {access.ok ? (
        <InvitationManagementPage />
      ) : (
        <InvitationAccessDenied
          code={access.error.code}
          message={access.error.message}
        />
      )}
    </main>
  );
}

export default App;
