import { DataGrid, type DataGridColumn, DeleteIcon, EditIcon, IconButton } from "@/components/ui";
import {
  formatCreatedDate,
  type Invitation,
  type InvitationsTableProps
} from "@/features/invitations/invitationManagement.shared";

import { StatusBadge } from "@/components/ui/StatusBadge";

const createInvitationColumns = ({
  canManageInvitations,
  onEditInvitation,
  onDeleteInvitation,
}: Pick<
  InvitationsTableProps,
  "canManageInvitations" | "onEditInvitation" | "onDeleteInvitation"
>): DataGridColumn<Invitation>[] => {
  const baseColumns: DataGridColumn<Invitation>[] = [
    {
      id: "name",
      header: "Name",
      renderCell: (invitation) => invitation.name,
    },
    {
      id: "email",
      header: "Email",
      renderCell: (invitation) => invitation.email,
    },
    {
      id: "role",
      header: "Role",
      renderCell: (invitation) => (
        <span className="capitalize">{invitation.role}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      renderCell: (invitation) => <StatusBadge status={invitation.status} />,
    },
    {
      id: "locale",
      header: "Locale",
      renderCell: (invitation) => invitation.locale,
    },
    {
      id: "created",
      header: "Created",
      renderCell: (invitation) => formatCreatedDate(invitation.createdAt),
    },
  ];

  if (!canManageInvitations) {
    return baseColumns;
  }

  return [
    {
      id: "actions",
      header: "Actions",
      width: "104px",
      isSticky: true,
      renderCell: (invitation) => (
        <div className="flex items-center gap-2">
          <IconButton
            label={`Edit invitation for ${invitation.name}`}
            onClick={() => onEditInvitation(invitation)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            label={`Delete invitation for ${invitation.name}`}
            variant="danger"
            onClick={() => onDeleteInvitation(invitation)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
    ...baseColumns,
  ];
};

export const InvitationsTable = ({
  invitations,
  canManageInvitations,
  onEditInvitation,
  onDeleteInvitation,
}: InvitationsTableProps) => {
  const invitationColumns = createInvitationColumns({
    canManageInvitations,
    onEditInvitation,
    onDeleteInvitation,
  });

  return (
    <DataGrid
      rows={invitations}
      columns={invitationColumns}
      getRowKey={(invitation) => invitation.id}
      ariaLabel="Invitations"
      emptyMessage="No invitations match the current filters."
    />
  );
};
