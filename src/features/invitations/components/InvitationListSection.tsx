import { useState } from "react";
import { Alert, Card } from "@/components/ui";
import type {
  Invitation,
  InvitationListSectionProps,
} from "@/features/invitations/invitationManagement.shared";
import { DeleteInvitationDialog } from "@/features/invitations/components/DeleteInvitationDialog";
import { EditInvitationDialog } from "@/features/invitations/components/EditInvitationDialog";
import { InvitationFilters } from "@/features/invitations/components/InvitationFilters";
import { InvitationPagination } from "@/features/invitations/components/InvitationPagination";
import { InvitationsTable } from "@/features/invitations/components/InvitationsTable";

type InvitationDialogState =
  | {
      type: "edit";
      invitation: Invitation;
    }
  | {
      type: "delete";
      invitation: Invitation;
    }
  | null;

export const InvitationListSection = ({
  invitationList,
  canManageInvitations,
}: InvitationListSectionProps) => {
  const [activeDialog, setActiveDialog] = useState<InvitationDialogState>(null);

  const hasLoadedSuccessfully =
    !invitationList.isLoading && !invitationList.errorMessage;

  const handleEditInvitation = (invitation: Invitation): void => {
    setActiveDialog({ type: "edit", invitation });
  };

  const handleDeleteInvitation = (invitation: Invitation): void => {
    setActiveDialog({ type: "delete", invitation });
  };

  const handleCloseDialog = (): void => {
    setActiveDialog(null);
  };

  return (
    <Card as="section">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Invitations</h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing {invitationList.filteredInvitationCount} matching invitation
            {invitationList.filteredInvitationCount === 1 ? "" : "s"}.
          </p>
        </div>

        <InvitationFilters
          searchQuery={invitationList.searchQuery}
          statusFilter={invitationList.statusFilter}
          onSearchQueryChange={invitationList.setSearchQuery}
          onStatusFilterChange={invitationList.setStatusFilter}
          onRefresh={invitationList.refresh}
        />
      </div>

      {invitationList.isLoading ? (
        <Alert variant="info">Loading invitations...</Alert>
      ) : null}

      {invitationList.errorMessage ? (
        <Alert variant="error">{invitationList.errorMessage}</Alert>
      ) : null}

      {hasLoadedSuccessfully ? (
        <InvitationsTable
          invitations={invitationList.invitations}
          canManageInvitations={canManageInvitations}
          onEditInvitation={handleEditInvitation}
          onDeleteInvitation={handleDeleteInvitation}
        />
      ) : null}

      <InvitationPagination
        currentPage={invitationList.currentPage}
        totalPages={invitationList.totalPages}
        onPreviousPage={invitationList.goToPreviousPage}
        onNextPage={invitationList.goToNextPage}
      />

      {activeDialog?.type === "edit" ? (
        <EditInvitationDialog
          invitation={activeDialog.invitation}
          onInvitationUpdated={invitationList.updateInvitationInList}
          onClose={handleCloseDialog}
        />
      ) : null}

      {activeDialog?.type === "delete" ? (
        <DeleteInvitationDialog
          invitation={activeDialog.invitation}
          onInvitationDeleted={invitationList.removeInvitation}
          onClose={handleCloseDialog}
        />
      ) : null}
    </Card>
  );
};
