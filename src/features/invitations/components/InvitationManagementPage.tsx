import { type UserRole } from "@/auth/accessControl";
import { Alert } from "@/components/ui";
import { useInvitationList } from "@/features/invitations/hooks/useInvitationListState";
import { CreateInvitationForm } from "@/features/invitations/components/CreateInvitationForm";
import { InvitationHeader } from "@/features/invitations/components/InvitationHeader";
import { InvitationListSection } from "@/features/invitations/components/InvitationListSection";

type InvitationManagementPageProps = {
  currentRole: UserRole;
};

export const InvitationManagementPage = ({
  currentRole,
}: InvitationManagementPageProps) => {
  const invitationList = useInvitationList();

  const canManageInvitations = currentRole === "admin";

  return (
    <div className="w-full px-6 py-8 text-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <InvitationHeader />

        {!canManageInvitations ? (
          <Alert variant="info">
            You are viewing invitations in read-only mode. Create, edit and
            delete actions are available only for admins.
          </Alert>
        ) : null}

        <section
          className={
            canManageInvitations
              ? "grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]"
              : "grid gap-8"
          }
        >
          {canManageInvitations ? (
            <CreateInvitationForm
              onInvitationCreated={invitationList.addInvitation}
            />
          ) : null}

          <div className="min-w-0">
            <InvitationListSection
              invitationList={invitationList}
              canManageInvitations={canManageInvitations}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
