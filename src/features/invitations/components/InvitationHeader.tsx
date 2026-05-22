import { Card } from "@/components/ui";

export const InvitationHeader = () => {
  return (
    <Card as="header" padding="lg">
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Invitation Management
          </h1>
        </div>
      </div>
    </Card>
  );
};
