import { useInvitationList } from "@/features/invitations/hooks/useInvitationListState";
import { CreateInvitationForm } from "@/features/invitations/components/CreateInvitationForm";
import { InvitationHeader } from "@/features/invitations/components/InvitationHeader";
import { InvitationListSection } from "@/features/invitations/components/InvitationListSection";

export const InvitationManagementPage = () => {
  const invitationList = useInvitationList();

  return (
    <div className="w-full px-6 py-8 text-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <InvitationHeader />

        <section className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <CreateInvitationForm
            onInvitationCreated={invitationList.addInvitation}
          />

          <div className="min-w-0">
            <InvitationListSection invitationList={invitationList} />
          </div>
        </section>
      </div>
    </div>
  );
};
