import { type ChangeEvent } from "react";
import { Button, SelectField, TextField } from "@/components/ui";
import {
  type InvitationFiltersProps,
  STATUS_FILTER_SELECT_OPTIONS,
  type StatusFilter,
} from "../invitationManagement.shared";

export const InvitationFilters = ({
  searchQuery,
  statusFilter,
  onSearchQueryChange,
  onStatusFilterChange,
  onRefresh,
}: InvitationFiltersProps) => {
  const handleSearchQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onSearchQueryChange(event.currentTarget.value);
  };

  const handleStatusFilterChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    onStatusFilterChange(event.currentTarget.value as StatusFilter);
  };

  const handleRefresh = (): void => {
    void onRefresh();
  };

  return (
    <div className="grid items-end gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_auto]">
      <TextField
        id="invitation-search"
        name="searchQuery"
        label="Search invitations by name or email"
        value={searchQuery}
        placeholder="Search name or email"
        isLabelHidden
        onChange={handleSearchQueryChange}
      />

      <SelectField
        id="invitation-status-filter"
        name="statusFilter"
        label="Filter invitations by status"
        value={statusFilter}
        options={STATUS_FILTER_SELECT_OPTIONS}
        isLabelHidden
        onChange={handleStatusFilterChange}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={handleRefresh}
        aria-label="Refresh invitations"
      >
        Refresh
      </Button>
    </div>
  );
};
