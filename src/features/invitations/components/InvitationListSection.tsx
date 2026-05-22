import { Alert, Card } from "@/components/ui";
import type { InvitationListSectionProps } from "@/features/invitations/invitationManagement.shared";
import { InvitationFilters } from "@/features/invitations/components/InvitationFilters";
import { InvitationPagination } from "@/features/invitations/components/InvitationPagination";
import { InvitationsTable } from "@/features/invitations/components/InvitationsTable";

export const InvitationListSection = ({
  invitationList,
}: InvitationListSectionProps) => {
  const hasLoadedSuccessfully =
    !invitationList.isLoading && !invitationList.errorMessage;

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
        <InvitationsTable invitations={invitationList.invitations} />
      ) : null}

      <InvitationPagination
        currentPage={invitationList.currentPage}
        totalPages={invitationList.totalPages}
        onPreviousPage={invitationList.goToPreviousPage}
        onNextPage={invitationList.goToNextPage}
      />
    </Card>
  );
};
