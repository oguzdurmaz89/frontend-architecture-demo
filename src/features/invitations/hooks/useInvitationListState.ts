import { useEffect, useMemo, useState } from "react";
import { fetchInvitations } from "@/api/invitationService";
import type { Invitation, InvitationStatus } from "@/domain/invitation";

const PAGE_SIZE = 5;
const LOAD_INVITATIONS_ERROR_MESSAGE =
  "Could not load invitations. Please try again.";
export type StatusFilter = InvitationStatus | "all";

export const useInvitationList = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQueryState] = useState("");
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvitations = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const matchesSearch =
        invitation.name.toLowerCase().includes(normalizedSearchQuery) ||
        invitation.email.toLowerCase().includes(normalizedSearchQuery);

      const matchesStatus =
        statusFilter === "all" || invitation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvitations.length / PAGE_SIZE),
  );

  const visibleCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvitations = useMemo(() => {
    const startIndex = (visibleCurrentPage - 1) * PAGE_SIZE;

    return filteredInvitations.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredInvitations, visibleCurrentPage]);

  const refresh = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchInvitations();
      setInvitations(result);
    } catch {
      setErrorMessage("Could not load invitations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const setSearchQuery = (value: string): void => {
    setSearchQueryState(value);
    setCurrentPage(1);
  };

  const setStatusFilter = (value: StatusFilter): void => {
    setStatusFilterState(value);
    setCurrentPage(1);
  };

  const addInvitation = (invitation: Invitation): void => {
    setInvitations((currentInvitations) => [invitation, ...currentInvitations]);
    setCurrentPage(1);
  };

  const updateInvitationInList = (updatedInvitation: Invitation): void => {
    setInvitations((currentInvitations) =>
      currentInvitations.map((invitation) =>
        invitation.id === updatedInvitation.id ? updatedInvitation : invitation,
      ),
    );
  };

  const removeInvitation = (invitationId: string): void => {
    setInvitations((currentInvitations) =>
      currentInvitations.filter((invitation) => invitation.id !== invitationId),
    );
  };

  const goToPreviousPage = (): void => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = (): void => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  useEffect(() => {
    let isActive = true;

    fetchInvitations()
      .then((result) => {
        if (!isActive) {
          return;
        }

        setInvitations(result);
        setErrorMessage(null);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setErrorMessage(LOAD_INVITATIONS_ERROR_MESSAGE);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return {
    invitations: paginatedInvitations,
    totalInvitations: invitations.length,
    filteredInvitationCount: filteredInvitations.length,
    isLoading,
    errorMessage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage: visibleCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    refresh,
    addInvitation,
    updateInvitationInList,
    removeInvitation,
  };
};
