import { DataGrid, type DataGridColumn } from "@/components/ui";
import {
  formatCreatedDate,
  type Invitation,
  type InvitationsTableProps,
} from "@/features/invitations/invitationManagement.shared";

import { StatusBadge } from "@/components/ui/StatusBadge";

const invitationColumns: DataGridColumn<Invitation>[] = [
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

export const InvitationsTable = ({ invitations }: InvitationsTableProps) => {
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
