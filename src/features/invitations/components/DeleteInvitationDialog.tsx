import { Alert, Button, Dialog } from "@/components/ui";
import { useDeleteInvitationMutation } from "@/features/invitations/hooks/useDeleteInvitationMutation";
import type { Invitation } from "@/features/invitations/invitationManagement.shared";

type DeleteInvitationDialogProps = {
  invitation: Invitation;
  onInvitationDeleted: (invitationId: string) => void;
  onClose: () => void;
};

export const DeleteInvitationDialog = ({
  invitation,
  onInvitationDeleted,
  onClose,
}: DeleteInvitationDialogProps) => {
  const {
    submission,
    isSubmitting,
    handleSubmit: deleteInvitation,
    reset: resetDeleteInvitationMutation,
  } = useDeleteInvitationMutation();

  const handleClose = (): void => {
    resetDeleteInvitationMutation();
    onClose();
  };

  const handleConfirmDelete = async (): Promise<void> => {
    const deletedInvitationId = await deleteInvitation(invitation);

    if (deletedInvitationId === null) {
      return;
    }

    onInvitationDeleted(deletedInvitationId);
    handleClose();
  };

  return (
    <Dialog
      title="Delete invitation"
      description="This action cannot be undone."
      onClose={handleClose}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete the invitation for{" "}
          <span className="font-medium text-slate-950">{invitation.name}</span>?
        </p>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-950">Email:</span>{" "}
            {invitation.email}
          </div>
          <div className="mt-1">
            <span className="font-medium text-slate-950">Role:</span>{" "}
            <span className="capitalize">{invitation.role}</span>
          </div>
        </div>

        {submission.status === "error" ? (
          <Alert variant="error" title={submission.error.message}>
            {submission.error.code ? (
              <span>Error code: {submission.error.code}</span>
            ) : null}
          </Alert>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            isLoading={isSubmitting}
            loadingLabel="Deleting..."
            onClick={handleConfirmDelete}
          >
            Delete invitation
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
