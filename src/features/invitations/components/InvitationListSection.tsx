import { useState } from "react";
import { Alert, Card } from "@/components/ui";
import type {
  Invitation,
  InvitationListSectionProps,
} from "@/features/invitations/invitationManagement.shared";
import { InvitationFilters } from "@/features/invitations/components/InvitationFilters";
import { InvitationPagination } from "@/features/invitations/components/InvitationPagination";
import { InvitationsTable } from "@/features/invitations/components/InvitationsTable";

export const InvitationListSection = ({
  invitationList,
  canManageInvitations,
}: InvitationListSectionProps) => {
  const [invitationToEdit, setInvitationToEdit] = useState<Invitation | null>(
    null,
  );
  const [invitationToDelete, setInvitationToDelete] =
    useState<Invitation | null>(null);

  const hasLoadedSuccessfully =
    !invitationList.isLoading && !invitationList.errorMessage;

  const handleEditInvitation = (invitation: Invitation): void => {
    setInvitationToEdit(invitation);
  };

  const handleDeleteInvitation = (invitation: Invitation): void => {
    setInvitationToDelete(invitation);
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

      {invitationToEdit ? (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Edit UI placeholder for {invitationToEdit.name}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setInvitationToEdit(null)}
          >
            Close
          </button>
        </div>
      ) : null}

      {invitationToDelete ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          Delete confirmation placeholder for {invitationToDelete.name}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setInvitationToDelete(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}
    </Card>
  );
};
