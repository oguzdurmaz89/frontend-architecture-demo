import {
  type ChangeEventHandler,
  type SubmitEventHandler,
  useState,
} from "react";
import {
  Alert,
  Button,
  FormCard,
  SelectField,
  TextField,
} from "@/components/ui";

import { useCreateInvitationMutation } from "@/features/invitations/hooks/useCreateInvitationMutation";

import {
  type CreateInvitationFormProps,
  type CreateInvitationInput,
  type FormErrors,
  INITIAL_FORM_VALUES,
  ROLE_SELECT_OPTIONS,
  validateCreateInvitationInput,
} from "@/features/invitations/invitationManagement.shared";

type InvitationFormElement = HTMLInputElement | HTMLSelectElement;

export const CreateInvitationForm = ({
  onInvitationCreated,
}: CreateInvitationFormProps) => {
  const {
    submission,
    handleSubmit: createInvitation,
    reset: resetCreateInvitationMutation,
  } = useCreateInvitationMutation();

  const [formValues, setFormValues] =
    useState<CreateInvitationInput>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isSubmitting = submission.status === "submitting";

  const handleChange: ChangeEventHandler<InvitationFormElement> = (event) => {
    const { name, value } = event.currentTarget;
    const fieldName = name as keyof CreateInvitationInput;

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const errors = validateCreateInvitationInput(formValues);

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const createdInvitation = await createInvitation({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      locale: formValues.locale.trim(),
      role: formValues.role,
    });

    if (createdInvitation === null) {
      return;
    }

    onInvitationCreated(createdInvitation);
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
  };

  const handleReset = (): void => {
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
    resetCreateInvitationMutation();
  };

  return (
    <FormCard onSubmit={handleSubmit} noValidate>
      <div>
        <h2 className="text-xl font-semibold">Create invitation</h2>
        <p className="mt-1 text-sm text-slate-500">
          New invitations are created with pending status.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <TextField
          id="invitation-name"
          name="name"
          label="Name"
          value={formValues.name}
          required
          autoComplete="name"
          placeholder="Jane Doe"
          error={formErrors.name}
          onChange={handleChange}
        />

        <TextField
          id="invitation-email"
          name="email"
          label="Email"
          value={formValues.email}
          type="email"
          required
          autoComplete="email"
          placeholder="jane@example.com"
          error={formErrors.email}
          onChange={handleChange}
        />

        <TextField
          id="invitation-locale"
          name="locale"
          label="Locale"
          value={formValues.locale}
          required
          autoComplete="language"
          placeholder="en-US"
          error={formErrors.locale}
          onChange={handleChange}
        />

        <SelectField
          id="invitation-role"
          name="role"
          label="Role"
          value={formValues.role}
          options={ROLE_SELECT_OPTIONS}
          required
          error={formErrors.role}
          onChange={handleChange}
        />
      </div>

      {submission.status === "error" ? (
        <Alert variant="error" title={submission.error.message}>
          {submission.error.code ? (
            <span>Error code: {submission.error.code}</span>
          ) : null}
        </Alert>
      ) : null}

      {submission.status === "success" ? (
        <Alert variant="success">
          Invitation created for{" "}
          <span className="font-medium">{submission.submittedInput.email}</span>
          .
        </Alert>
      ) : null}

      <div className="mt-6 flex gap-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingLabel="Creating..."
        >
          Create invitation
        </Button>

        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </FormCard>
  );
};
