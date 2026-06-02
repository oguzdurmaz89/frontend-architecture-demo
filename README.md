# InviteFlow Frontend Architecture

A compact React + TypeScript admin application for managing user access invitations.

The project is intentionally small, but it is structured like a real frontend feature: typed domain models, a service
boundary, feature hooks, reusable UI primitives, role-aware behavior, and automated test coverage.

## What the Application Does

The app supports two demo roles.

**Admin users can:**

- View invitations
- Search invitations by name or email
- Filter invitations by status
- Navigate paginated results
- Create a new invitation
- Edit an existing invitation
- Delete an invitation after confirmation

**Viewer users can:**

- View the invitation list in read-only mode
- Search, filter, and paginate the list
- See a read-only information message

Viewer users cannot see the create form or row-level edit/delete actions. This keeps read access and mutation access
separate, which is closer to how real admin tools usually behave.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Playwright
- In-memory mocked data source

## Getting Started

This project uses Node.js `22.12.0`.

```bash
nvm use
npm install
npm run dev
```

Then open the local URL shown in the terminal. With Vite, this is usually:

```bash
http://localhost:5173
```

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
npm run test:unit
npm run test:e2e
npm run test:all
```

## Project Structure

```text
src/
  api/
    errors.ts
    invitationService.ts
    invitationService.test.ts
    mockInvitations.ts

  auth/
    accessControl.ts

  components/ui/
    Alert.tsx
    Badge.tsx
    Button.tsx
    Card.tsx
    DataGrid.tsx
    Dialog.tsx
    FormCard.tsx
    IconButton.tsx
    SelectField.tsx
    TextField.tsx
    EditIcon.tsx
    DeleteIcon.tsx
    ui.shared.ts

  domain/
    invitation.ts

  features/invitations/
    invitationManagement.shared.ts
    invitationManagement.shared.test.ts

    components/
      CreateInvitationForm.tsx
      DeleteInvitationDialog.tsx
      EditInvitationDialog.tsx
      InvitationFilters.tsx
      InvitationHeader.tsx
      InvitationListSection.tsx
      InvitationManagementPage.tsx
      InvitationPagination.tsx
      InvitationsTable.tsx
      RoleSwitcher.tsx
      StatusBadge.tsx

    hooks/
      useCreateInvitationMutation.ts
      useDeleteInvitationMutation.ts
      useInvitationListState.ts
      useUpdateInvitationMutation.ts

  test/
    setup.ts

e2e/
  invitation-management.spec.ts
```

## Architecture Overview

### Domain Layer

The invitation model lives in `src/domain/invitation.ts`.

Core types include:

- `Invitation`
- `InvitationRole`
- `InvitationStatus`
- `CreateInvitationInput`
- `UpdateInvitationInput`

These types are shared by the service layer, validation helpers, mutation hooks, and UI components.

### Service Layer

Invitation data operations are isolated in `src/api/invitationService.ts`.

Implemented operations:

- `fetchInvitations`
- `createInvitation`
- `updateInvitation`
- `deleteInvitation`

The current implementation uses an in-memory mocked data source. The UI and feature hooks do not access the mock data
directly. This keeps the data boundary explicit and makes it easier to replace the mocked implementation with real HTTP
calls later.

The service layer also owns business rules such as email normalization, duplicate email checks, missing invitation
errors, and default invitation metadata.

### Feature State

The invitation list state is handled by `useInvitationList`.

It owns loading state, error state, search, status filtering, pagination, refresh, and local list updates after create,
edit, and delete operations.

This keeps list behavior separate from rendering components.

### Mutation Hooks

Create, update, and delete operations each have their own mutation hook:

- `useCreateInvitationMutation`
- `useUpdateInvitationMutation`
- `useDeleteInvitationMutation`

Each hook models the mutation lifecycle with a discriminated union:

- `idle`
- `submitting`
- `success`
- `error`

This avoids ambiguous state combinations and keeps submitted context available for the UI.

### Role-Aware UI Behavior

Role behavior is intentionally simple:

- Admins can create, edit, and delete invitations.
- Viewers can read the invitation list but cannot mutate it.
- The create form and row-level actions are not rendered for viewers.

This is not a full authentication system. It models how the frontend reacts to access decisions. In production,
authorization would still need to be enforced by the backend.

### UI Foundation

The project includes a small reusable UI layer in `src/components/ui` for generic components such as buttons, form
fields, alerts, cards, dialogs, and the data grid.

Domain-specific UI remains inside the invitation feature. For example, `StatusBadge` lives under
`features/invitations/components` because it depends on invitation statuses and invitation-specific badge tones.

## Validation

Validation helpers live in `features/invitations/invitationManagement.shared.ts`.

Create validation checks:

- Name is required
- Email is required
- Email must look valid
- Locale is required
- Role must be valid

Update validation checks the same fields and also validates status.

Duplicate email validation is handled by the service layer because it depends on existing invitation data.

## Testing

The project uses both unit tests and end-to-end tests.

### Unit Tests

Unit tests are written with Vitest and cover:

- Create invitation validation
- Update invitation validation
- Creating invitations through the service layer
- Email normalization
- Duplicate email errors
- Updating invitations
- Preventing update conflicts when another invitation already uses the email
- Missing invitation errors
- Deleting invitations

Unit tests live next to the code they validate:

```text
src/api/invitationService.test.ts
src/features/invitations/invitationManagement.shared.test.ts
```

### End-to-End Tests

End-to-end tests are written with Playwright and cover:

- Admin can create, edit, and delete an invitation
- Delete requires confirmation
- Viewer can read invitations
- Viewer cannot see create, edit, or delete actions

The tests use user-facing accessible selectors and scoped assertions instead of implementation-specific selectors.

E2E tests live in:

```text
e2e/invitation-management.spec.ts
```

## Key Technical Decisions

### Typed Service Boundary

The UI does not directly own data operations. Fetching, creating, updating, and deleting invitations are handled through
a typed service layer.

The alternative would be to keep data manipulation inside components or hooks. That is simpler at first, but harder to
replace with a real API later.

### Explicit Mutation State

Each mutation flow has an explicit lifecycle state.

The alternative would be separate booleans such as `isLoading`, `error`, and `success`. That can create invalid
combinations. A discriminated union keeps the state model safer and easier to understand.

### Read-Only Viewer Experience

Viewer access is read-only instead of fully blocked.

In many real products, viewing data and mutating data are separate permissions. This makes the behavior closer to a
realistic admin interface.

### Separate Create, Update, and Delete Hooks

Create, update, and delete each have their own mutation hook.

The flows are similar, but not identical. Create owns new form data, update owns pre-filled form data, and delete owns a
destructive confirmation flow. A generic mutation abstraction could be introduced later if the repetition grew, but
explicit hooks are easier to read at this size.

## Tradeoffs

- The data source is in memory and resets on refresh.
- Authentication is simplified to a demo role switcher.
- Authorization is represented in the UI, but real authorization would belong on the backend.
- Filtering, searching, and pagination are handled client-side.
- Validation is intentionally lightweight.
- The dialog shell does not implement a full focus trap.
- There is no caching or retry strategy beyond the mocked request lifecycle.
- No optimistic update strategy is implemented.

## Production Improvements

If this were moved toward production, the next improvements would be:

- Replace the mocked service internals with real API calls
- Enforce authorization on the backend
- Move filtering, sorting, and pagination to the backend for larger datasets
- Add schema-based validation shared between UI and API boundaries
- Add stronger email and locale validation
- Add request cancellation for list loading
- Add caching and invalidation with a server-state library such as TanStack Query
- Add optimistic updates where appropriate
- Add a focus trap and stronger keyboard handling to the dialog
- Add monitoring and structured error reporting
- Expand test coverage around UI edge cases and accessibility behavior

## Quality Checklist

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

## Summary

This project demonstrates a compact but complete frontend feature with clear boundaries:

- Typed domain modelling
- Service-layer data operations
- Explicit async mutation state
- Role-aware UI behavior
- Reusable UI primitives
- Feature-specific components where appropriate
- Unit and E2E test coverage
- Clear tradeoffs and production growth paths
