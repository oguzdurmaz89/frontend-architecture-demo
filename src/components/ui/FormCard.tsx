import type { FormHTMLAttributes, ReactNode } from "react";

type FormCardProps = Omit<FormHTMLAttributes<HTMLFormElement>, "className"> & {
  children: ReactNode;
};

export const FormCard = ({ children, ...formProps }: FormCardProps) => {
  return (
    <form {...formProps} className="h-fit rounded-3xl bg-white p-6 shadow-sm">
      {children}
    </form>
  );
};
