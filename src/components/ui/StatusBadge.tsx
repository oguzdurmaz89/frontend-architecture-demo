import { Badge } from "@/components/ui/index";
import {
  STATUS_BADGE_TONES,
  type StatusBadgeProps,
} from "@/features/invitations/invitationManagement.shared";

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return <Badge tone={STATUS_BADGE_TONES[status]}>{status}</Badge>;
};
