# Frontend Architecture Demo

A small standalone admin-facing web application for managing user access invitations.

This project is designed as a discussion-friendly frontend architecture demo. It focuses on TypeScript modelling, typed
client/data boundaries, async mutation state, list state management, validation feedback, role-based UI behavior,
accessibility, testing, and production tradeoffs.

The goal is to provide a compact project that can be reviewed and discussed clearly without relying on confidential
production code.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- In-memory mocked data source

## Getting Started

### Prerequisites

This project uses Node.js `22.12.0`.

If you use `nvm`, run:

```bash
nvm use
```

If the correct version is not installed yet:

```bash
nvm install 22.12.0
nvm use 22.12.0
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal. With Vite, this is usually:

```bash
http://localhost:5173
```

### Run linting

```bash
npm run lint
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Overview

The application allows an admin user to:

- View existing invitations
- Search invitations by name or email
- Filter invitations by status
- Navigate invitations with pagination
- Create a new invitation
- See loading, success, validation, and request failure feedback
- Switch between `admin` and `viewer` roles to verify role-based behavior

The UI is intentionally simple. The goal is to demonstrate correct behavior, maintainable structure, typed boundaries,
accessibility, and clear async state handling rather than building a production-polished interface.

## Architecture Overview

The project is split into small areas of responsibility:

```text
src/
  api/                         Mocked service layer and API errors
  auth/                        Role and permission helpers
  boundaries/                  Application boundary / access guard
  components/ui/               Small reusable UI primitives
  domain/                      Invitation domain types
  features/invitations/        Invitation-specific hooks, components, and shared helpers
```

### Domain Layer

The invitation model is defined with TypeScript types in `src/domain/invitation.ts`.

Core domain concepts:

- `Invitation`
- `InvitationStatus`
- `InvitationRole`
- `CreateInvitationInput`

These types are shared by the service layer, hooks, validation helpers, and UI components.

### API / Service Layer

Invitation data operations are isolated behind a typed service layer in `src/api/invitationService.ts`.

Implemented service functions:

- `fetchInvitations`
- `createInvitation`

The current implementation uses an in-memory mocked data source from `src/api/mockInvitations.ts`. This keeps the
project lightweight while still showing a clear boundary between UI logic and data operations.

If this became production code, the internals of the service functions could be replaced with real HTTP calls while
keeping most of the UI and hook logic unchanged.

### Async Mutation Hook

The create invitation flow is handled by `useCreateInvitationMutation`.

The hook exposes:

- `submission`
- `handleSubmit`
- `reset`
- `isSubmitting`

The mutation state is stored in `submission` and models:

- `idle`
- `submitting`
- `success`
- `error`

On success, the hook preserves the submitted input and the returned invitation.

On failure, it preserves useful context such as the error message, error code, status code, error context, and submitted
input.

### Invitation List State

The invitation overview state is managed by `useInvitationList`.

It handles:

- Loading invitations
- Loading state
- Error state
- Search by name or email
- Filtering by status
- Pagination
- Adding a newly created invitation to the list
- Refreshing the invitation list

This keeps list behavior separate from rendering components.

### Role-Based Access Boundary

A lightweight client-side guard represents role-based UI behavior.

Implemented boundary:

```ts
const guardInvitationManagementAccess: (
    role: UserRole,
) => InvitationManagementAccessResult;
```

Current behavior:

- `admin` can access the invitation management view
- `viewer` sees an access denied state

This is intentionally not a production authentication system. It only represents how the UI reacts to access decisions.

## API / Interface Description

### `fetchInvitations`

Fetches the current list of invitations from the mocked data source.

```ts
const fetchInvitations: () => Promise<Invitation[]>;
```

#### Response Shape

```ts
type Invitation = {
    id: string;
    name: string;
    email: string;
    locale: string;
    role: "admin" | "clinician" | "coordinator";
    status: "pending" | "accepted" | "expired" | "revoked";
    createdAt: string;
};
```

#### Example Response

```ts
[
    {
        id: "invitation-1",
        name: "Anna Jensen",
        email: "anna.jensen@example.com",
        locale: "da-DK",
        role: "clinician",
        status: "pending",
        createdAt: "2026-05-01T09:00:00.000Z"
    }
]
```

### `createInvitation`

Creates a new invitation and adds it to the mocked data source.

```ts
const createInvitation: (
    input: CreateInvitationInput,
) => Promise<Invitation>;
```

#### Request Shape

```ts
type CreateInvitationInput = {
    name: string;
    email: string;
    locale: string;
    role: "admin" | "clinician" | "coordinator";
};
```

#### Example Request

```ts
{
    name: "Jane Doe",
        email
:
    "jane.doe@example.com",
        locale
:
    "en-US",
        role
:
    "clinician"
}
```

#### Example Response

```ts
{
    id: "generated-id",
        name
:
    "Jane Doe",
        email
:
    "jane.doe@example.com",
        locale
:
    "en-US",
        role
:
    "clinician",
        status
:
    "pending",
        createdAt
:
    "2026-05-08T10:00:00.000Z"
}
```

#### Error Cases

The service can throw an `ApiError` for duplicate email addresses.

```ts
{
    code: "DUPLICATE_EMAIL",
        message
:
    "An invitation with this email already exists.",
        statusCode
:
    409,
        context
:
    {
        email: "jane.doe@example.com"
    }
}
```

The mutation hook maps service errors into its `error` state while preserving the submitted input.

### `guardInvitationManagementAccess`

Guards the invitation management view based on the current demo role.

```ts
type UserRole = "admin" | "viewer";

type InvitationManagementAccessResult =
    | { ok: true }
    | {
    ok: false;
    error: {
        code: "FORBIDDEN";
        message: string;
    };
};

const guardInvitationManagementAccess: (
    role: UserRole,
) => InvitationManagementAccessResult;
```

#### Example Success Response

```ts
{
    ok: true
}
```

#### Example Error Response

```ts
{
    ok: false,
        error
:
    {
        code: "FORBIDDEN",
            message
    :
        "Only admins can manage invitations."
    }
}
```

## Validation Behavior

The create invitation form validates:

- Name is required
- Email is required
- Email must look valid
- Locale is required
- Role must be valid

Duplicate email validation is handled by the service layer and displayed as request failure feedback in the UI.

## Assumptions

- A real backend is not included.
- Invitation data can be stored in memory for the purpose of demonstrating behavior.
- Authentication can be mocked or simplified.
- New invitations are created with `pending` status.
- `id`, `createdAt`, and `status` are generated by the service layer rather than submitted by the user.
- The UI does not need to be production-polished, but it should clearly show the required behavior.

## Tradeoffs

- I used an in-memory mocked data source instead of a real API to keep the implementation focused.
- I wrote a custom mutation hook instead of using a library such as TanStack Query because I wanted to show the async
  mutation flow explicitly.
- I kept role-based access simple instead of implementing login, sessions, or tokens.
- I kept validation lightweight and local to the form/service layer.
- I focused on structure, correctness, accessibility, and maintainability rather than extensive styling or framework
  complexity.

## Known Limitations

- Data is not persisted after page refresh.
- There is no real authentication or authorization backend.
- Automated tests are not included yet.
- Validation is intentionally basic.
- There is no caching, retry logic, or advanced request cancellation.
- The mocked API only covers the operations currently implemented in the demo.

## What I Would Improve Next

With more time, I would consider adding:

- Edit invitation flow
- Delete invitation flow with confirmation
- Read-only viewer behavior
- Unit tests for the mutation hook, service layer, validation, and list state logic
- End-to-end tests for admin and viewer flows
- More robust email and locale validation
- Real API integration
- Better error mapping between backend errors and UI messages
- Request cancellation for list loading
- Caching and retry behavior with TanStack Query
- Optimistic updates where appropriate
- More complete accessibility testing
- More complete role and permission modelling
- Persisted data using a lightweight local API or backend
