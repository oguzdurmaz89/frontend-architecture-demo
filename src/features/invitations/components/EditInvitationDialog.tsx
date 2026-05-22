import {
  type ChangeEventHandler,
  type SubmitEventHandler,
  useState,
} from "react";
import { Alert, Button, Dialog, SelectField, TextField } from "@/components/ui";
import { useUpdateInvitationMutation } from "@/features/invitations/hooks/useUpdateInvitationMutation";
import {
  type Invitation,
  ROLE_SELECT_OPTIONS,
  STATUS_SELECT_OPTIONS,
  type UpdateInvitationFormErrors,
  type UpdateInvitationInput,
  validateUpdateInvitationInput,
} from "@/features/invitations/invitationManagement.shared";

type EditInvitationDialogProps = {
  invitation: Invitation;
  onInvitationUpdated: (invitation: Invitation) => void;
  onClose: () => void;
};

type EditInvitationFormElement = HTMLInputElement | HTMLSelectElement;

export const EditInvitationDialog = ({
  invitation,
  onInvitationUpdated,
  onClose,
}: EditInvitationDialogProps) => {
  const {
    submission,
    handleSubmit: updateInvitation,
    reset: resetUpdateInvitationMutation,
  } = useUpdateInvitationMutation();

  const [formValues, setFormValues] = useState<UpdateInvitationInput>({
    name: invitation.name,
    email: invitation.email,
    locale: invitation.locale,
    role: invitation.role,
    status: invitation.status,
  });

  const [formErrors, setFormErrors] = useState<UpdateInvitationFormErrors>({});

  const isSubmitting = submission.status === "submitting";

  const handleChange: ChangeEventHandler<EditInvitationFormElement> = (
    event,
  ) => {
    const { name, value } = event.currentTarget;
    const fieldName = name as keyof UpdateInvitationInput;

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  };

  const handleClose = (): void => {
    resetUpdateInvitationMutation();
    onClose();
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const errors = validateUpdateInvitationInput(formValues);

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const updatedInvitation = await updateInvitation(invitation.id, {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      locale: formValues.locale.trim(),
      role: formValues.role,
      status: formValues.status,
    });

    if (updatedInvitation === null) {
      return;
    }

    onInvitationUpdated(updatedInvitation);
    handleClose();
  };

  return (
    <Dialog
      title="Edit invitation"
      description={`Update invitation details for ${invitation.name}.`}
      size="lg"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="edit-invitation-name"
            name="name"
            label="Name"
            value={formValues.name}
            required
            autoComplete="name"
            placeholder="Jane Doe"
            error={formErrors.name}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <TextField
            id="edit-invitation-email"
            name="email"
            label="Email"
            value={formValues.email}
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            error={formErrors.email}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <TextField
            id="edit-invitation-locale"
            name="locale"
            label="Locale"
            value={formValues.locale}
            required
            autoComplete="language"
            placeholder="en-US"
            error={formErrors.locale}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <SelectField
            id="edit-invitation-role"
            name="role"
            label="Role"
            value={formValues.role}
            options={ROLE_SELECT_OPTIONS}
            required
            error={formErrors.role}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <div className="sm:col-span-2">
            <SelectField
              id="edit-invitation-status"
              name="status"
              label="Status"
              value={formValues.status}
              options={STATUS_SELECT_OPTIONS}
              required
              error={formErrors.status}
              disabled={isSubmitting}
              onChange={handleChange}
            />
          </div>
        </div>

        {submission.status === "error" ? (
          <div className="mt-5">
            <Alert variant="error" title={submission.error.message}>
              {submission.error.code ? (
                <span>Error code: {submission.error.code}</span>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingLabel="Saving..."
          >
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
