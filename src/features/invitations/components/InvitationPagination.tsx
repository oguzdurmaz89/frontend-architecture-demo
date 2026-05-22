import { Button } from "@/components/ui";
import type { InvitationPaginationProps } from "@/features/invitations/invitationManagement.shared";

export const InvitationPagination = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: InvitationPaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-5 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onPreviousPage}
          disabled={isFirstPage}
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onNextPage}
          disabled={isLastPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
