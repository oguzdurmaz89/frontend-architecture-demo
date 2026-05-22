export type ErrorCode =
  | "DUPLICATE_EMAIL"
  | "INVITATION_NOT_FOUND"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "FORBIDDEN"
  | "UNKNOWN_ERROR";

type ErrorOptions = {
  code: ErrorCode;
  message: string;
  statusCode: number;
  context?: Record<string, unknown>;
};

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly context?: Record<string, unknown>;

  public constructor(options: ErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.context = options.context;
  }
}
