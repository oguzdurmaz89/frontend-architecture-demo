type InvitationAccessDeniedProps = {
  code: string;
  message: string;
};

export const InvitationAccessDenied = ({
  code,
  message,
}: InvitationAccessDeniedProps) => {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-6">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide">{code}</p>
        <h1 className="mt-2 text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm">{message}</p>
      </div>
    </section>
  );
};
