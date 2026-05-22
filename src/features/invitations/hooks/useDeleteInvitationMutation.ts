import { useCallback, useState } from "react";
import { ApiError } from "@/api/errors";
import { deleteInvitation } from "@/api/invitationService";
import type { Invitation } from "@/domain/invitation";

type DeleteInvitationError = {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
};

type DeleteInvitationMutation =
  | {
      status: "idle";
      data: null;
      error: null;
      submittedInvitation: null;
    }
  | {
      status: "submitting";
      data: null;
      error: null;
      submittedInvitation: Invitation;
    }
  | {
      status: "success";
      data: string;
      error: null;
      submittedInvitation: Invitation;
    }
  | {
      status: "error";
      data: null;
      error: DeleteInvitationError;
      submittedInvitation: Invitation;
    };

const initialState: DeleteInvitationMutation = {
  status: "idle",
  data: null,
  error: null,
  submittedInvitation: null,
};

const getDeleteInvitationError = (error: unknown): DeleteInvitationError => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      context: error.context,
    };
  }

  return {
    message: "An unexpected error occurred.",
  };
};

export const useDeleteInvitationMutation = () => {
  const [submission, setSubmission] =
    useState<DeleteInvitationMutation>(initialState);

  const handleSubmit = useCallback(
    async (invitation: Invitation): Promise<string | null> => {
      setSubmission({
        status: "submitting",
        data: null,
        error: null,
        submittedInvitation: invitation,
      });

      try {
        const deletedInvitationId = await deleteInvitation(invitation.id);

        setSubmission({
          status: "success",
          data: deletedInvitationId,
          error: null,
          submittedInvitation: invitation,
        });

        return deletedInvitationId;
      } catch (error) {
        setSubmission({
          status: "error",
          data: null,
          error: getDeleteInvitationError(error),
          submittedInvitation: invitation,
        });

        return null;
      }
    },
    [],
  );

  const reset = useCallback((): void => {
    setSubmission(initialState);
  }, []);

  return {
    submission,
    isSubmitting: submission.status === "submitting",
    handleSubmit,
    reset,
  };
};
