import { useCallback, useState } from "react";
import { ApiError } from "@/api/errors";
import { updateInvitation } from "@/api/invitationService";
import type { Invitation, UpdateInvitationInput } from "@/domain/invitation";

type UpdateInvitationError = {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
};

type UpdateInvitationMutation =
  | {
      status: "idle";
      data: null;
      error: null;
      submittedInput: null;
    }
  | {
      status: "submitting";
      data: null;
      error: null;
      submittedInput: UpdateInvitationInput;
    }
  | {
      status: "success";
      data: Invitation;
      error: null;
      submittedInput: UpdateInvitationInput;
    }
  | {
      status: "error";
      data: null;
      error: UpdateInvitationError;
      submittedInput: UpdateInvitationInput;
    };

const initialState: UpdateInvitationMutation = {
  status: "idle",
  data: null,
  error: null,
  submittedInput: null,
};

const getUpdateInvitationError = (error: unknown): UpdateInvitationError => {
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

export const useUpdateInvitationMutation = () => {
  const [submission, setSubmission] =
    useState<UpdateInvitationMutation>(initialState);

  const handleSubmit = useCallback(
    async (
      invitationId: string,
      input: UpdateInvitationInput,
    ): Promise<Invitation | null> => {
      setSubmission({
        status: "submitting",
        data: null,
        error: null,
        submittedInput: input,
      });

      try {
        const invitation = await updateInvitation(invitationId, input);

        setSubmission({
          status: "success",
          data: invitation,
          error: null,
          submittedInput: input,
        });

        return invitation;
      } catch (error) {
        setSubmission({
          status: "error",
          data: null,
          error: getUpdateInvitationError(error),
          submittedInput: input,
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
