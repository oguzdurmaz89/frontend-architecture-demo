import { useState } from "react";
import { type UserRole } from "@/auth/accessControl";
import { InvitationManagementPage } from "@/features/invitations/components/InvitationManagementPage";
import { RoleSwitcher } from "@/features/invitations/components/RoleSwitcher";

function App() {
  const [role, setRole] = useState<UserRole>("admin");

  const handleRoleChange = (selectedRole: UserRole): void => {
    setRole(selectedRole);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <RoleSwitcher role={role} onRoleChange={handleRoleChange} />

      <InvitationManagementPage currentRole={role} />
    </main>
  );
}

export default App;
