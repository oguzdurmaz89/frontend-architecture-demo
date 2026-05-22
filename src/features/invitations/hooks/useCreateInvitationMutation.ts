import { useCallback, useState } from "react";
import { ApiError } from "@/api/errors";
import { createInvitation } from "@/api/invitationService";
import type { CreateInvitationInput, Invitation } from "@/domain/invitation";

type CreateInvitationError = {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
};

type CreateInvitationMutation =
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
      submittedInput: CreateInvitationInput;
    }
  | {
      status: "success";
      data: Invitation;
      error: null;
      submittedInput: CreateInvitationInput;
    }
  | {
      status: "error";
      data: null;
      error: CreateInvitationError;
      submittedInput: CreateInvitationInput;
    };

const initialState: CreateInvitationMutation = {
  status: "idle",
  data: null,
  error: null,
  submittedInput: null,
};

const getCreateInvitationError = (error: unknown): CreateInvitationError => {
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

export const useCreateInvitationMutation = () => {
  const [submission, setSubmission] =
    useState<CreateInvitationMutation>(initialState);

  const handleSubmit = useCallback(
    async (input: CreateInvitationInput): Promise<Invitation | null> => {
      setSubmission({
        status: "submitting",
        data: null,
        error: null,
        submittedInput: input,
      });

      try {
        const invitation = await createInvitation(input);

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
          error: getCreateInvitationError(error),
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
