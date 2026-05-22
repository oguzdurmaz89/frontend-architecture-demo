# Frontend Architecture Demo

A small React + TypeScript admin application for managing user access invitations.

The project is intentionally compact, but it is structured like a real frontend feature: typed domain models, a service
boundary, feature hooks, reusable UI primitives, role-aware behavior, accessible table patterns, and automated test
coverage.

## What the Application Does

The application has two demo roles:

### Admin

An admin can:

- View invitations
- Search invitations by name or email
- Filter invitations by status
- Navigate paginated invitation results
- Create a new invitation
- Edit an existing invitation
- Delete an invitation after confirmation

### Viewer

A viewer can:

- View the invitation list in read-only mode
- Search, filter, and paginate the list
- See a read-only information message

A viewer cannot:

- See the create invitation form
- See edit actions
- See delete actions

This models a more realistic permission split between reading data and mutating data.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- Playwright
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

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Then open the local URL shown in the terminal. With Vite, this is usually:

```bash
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript build checks and creates a production build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run test:unit
```

Runs unit tests with Vitest.

```bash
npm run test:unit:watch
```

Runs Vitest in watch mode.

```bash
npm run test:e2e
```

Runs end-to-end tests with Playwright.

```bash
npm run test:e2e:ui
```

Runs Playwright in UI mode.

```bash
npm run test:e2e:headed
```

Runs Playwright tests in headed browser mode.

```bash
npm run test:e2e:report
```

Opens the Playwright HTML report.

```bash
npm run test:all
```

Runs unit tests and end-to-end tests.

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

  boundaries/
    guardInvitationManagementAccess.ts

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
      EditInvitationDialog.tsx
      DeleteInvitationDialog.tsx
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
      useUpdateInvitationMutation.ts
      useDeleteInvitationMutation.ts
      useInvitationListState.ts

  test/
    setup.ts

e2e/
  invitation-management.spec.ts
```

## Architecture Overview

The application is split into clear areas of responsibility.

### Domain Layer

The invitation domain is defined in `src/domain/invitation.ts`.

Core types:

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

The service layer also handles business rules such as:

- Normalizing email addresses before storing or comparing them
- Preventing duplicate email addresses
- Returning typed `ApiError` failures for duplicate emails and missing invitations
- Creating default invitation metadata such as `id`, `createdAt`, and initial `pending` status

### Feature State

The invitation list state is handled by `useInvitationList`.

It owns:

- Initial data loading
- Loading state
- Error state
- Search query
- Status filter
- Pagination
- Adding newly created invitations to the list
- Updating edited invitations in the list
- Removing deleted invitations from the list
- Refreshing the invitation list from the service layer

This keeps list behavior separate from rendering components.

### Mutation Hooks

Create, update, and delete operations each have their own mutation hook:

- `useCreateInvitationMutation`
- `useUpdateInvitationMutation`
- `useDeleteInvitationMutation`

Each hook models the mutation lifecycle explicitly with a discriminated union:

- `idle`
- `submitting`
- `success`
- `error`

This avoids ambiguous combinations like loading and error being true at the same time, keeps submitted context
available, and makes UI states easier to reason about.

### Role-Aware UI Behavior

The UI supports two demo roles: `admin` and `viewer`.

Role behavior is intentionally simple:

- Admins can create, edit, and delete invitations.
- Viewers can read the invitation list but cannot mutate it.
- The create form and row-level actions are not rendered for viewers.
- Viewers receive a read-only information message.

This is not a full authentication or authorization system. It models how the frontend can react to access decisions. In
a production system, authorization would still need to be enforced by the backend.

### UI Foundation

The project includes a small reusable UI layer in `src/components/ui`.

Reusable primitives include:

- `Button`
- `IconButton`
- `TextField`
- `SelectField`
- `Alert`
- `Badge`
- `Card`
- `FormCard`
- `Dialog`
- `DataGrid`

Domain-specific components remain inside the invitation feature. For example, `StatusBadge` lives under
`features/invitations/components` because it depends on invitation statuses and invitation-specific badge tones.

## Accessibility and UX Decisions

### Semantic Table

The invitation list uses a semantic HTML table through `DataGrid`.

The table uses native table elements:

- `table`
- `thead`
- `tbody`
- `tr`
- `th`
- `td`

This is intentional because invitations are tabular data. Native table semantics give screen readers clearer
relationships between rows, columns, and headers than a div-based table simulation.

### Sticky Actions Column

Admin actions are placed in a sticky left column.

This keeps edit and delete actions available while the table scrolls horizontally on smaller screens. The tradeoff is a
little more table styling, but it improves usability without giving up semantic table structure.

### Accessible Action Buttons

Row actions use `IconButton` with explicit `aria-label` values such as:

```text
Edit invitation for Jane Doe
Delete invitation for Jane Doe
```

The visible UI can stay compact while the accessible name remains clear.

### Dialogs

Edit and delete flows use a shared `Dialog` shell.

The dialog provides:

- `role="dialog"`
- `aria-modal="true"`
- labelled title
- optional description
- close button
- Escape key close behavior

The edit and delete content remains feature-specific, while the dialog shell remains reusable.

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

Unit tests are written with Vitest.

Covered areas:

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

End-to-end tests are written with Playwright.

Covered flows:

- Admin can create, edit, and delete an invitation
- Delete requires confirmation
- Viewer can read invitations
- Viewer cannot see create, edit, or delete actions

The tests use user-facing accessible selectors and scoped assertions. For example, table data is asserted within the
`Invitations` table, and dialog fields are asserted inside the active dialog. This keeps the tests closer to user
behavior and avoids brittle implementation selectors.

E2E tests live in:

```text
e2e/invitation-management.spec.ts
```

## Key Technical Decisions

### Typed Service Boundary

The UI does not directly own data operations. Fetching, creating, updating, and deleting invitations are handled through
a typed service layer.

The alternative would be to keep data manipulation inside components or hooks. That would be simpler at first, but
harder to replace with a real API later.

### Explicit Mutation State

Each mutation flow has an explicit lifecycle state.

The alternative would be separate booleans such as `isLoading`, `error`, and `success`. That can create invalid
combinations. A discriminated union keeps the state model safer and easier to understand.

### Feature-Specific Status Badge

`StatusBadge` is kept inside the invitations feature instead of the generic UI layer.

The reason is that it understands invitation statuses and invitation-specific badge tones. It is not a generic badge
primitive.

### Semantic Data Grid

The table is implemented with semantic HTML because the data is tabular.

A div-based grid can offer layout flexibility, but a native table is more appropriate here for accessibility and data
relationships.

### Read-Only Viewer Experience

Viewer access is read-only instead of fully blocked.

In many real products, viewing data and mutating data are separate permissions. This makes the demo behavior closer to a
realistic admin interface.

### Separate Create, Update, and Delete Hooks

Create, update, and delete each have their own mutation hook.

The flows are similar, but not identical:

- Create owns new form data and returns a new invitation.
- Update owns pre-filled form data and returns an updated invitation.
- Delete owns a destructive confirmation flow and returns the deleted invitation id.

A generic mutation abstraction could be introduced later if the repetition grew, but explicit hooks are easier to read
at this size.

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

Before pushing changes, run:

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
- Semantic and accessible table structure
- Reusable UI primitives
- Feature-specific components where appropriate
- Unit and E2E test coverage
- Clear tradeoffs and production growth paths
