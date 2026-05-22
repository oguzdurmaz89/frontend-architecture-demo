import type { ReactNode } from "react";

type CardElement = "div" | "section" | "header";

type CardPadding = "md" | "lg";

type CardProps = {
  children: ReactNode;
  as?: CardElement;
  padding?: CardPadding;
};

const cardPaddingClassNames: Record<CardPadding, string> = {
  md: "p-6",
  lg: "p-8",
};

export const Card = ({
  children,
  as: Component = "div",
  padding = "md",
}: CardProps) => {
  return (
    <Component
      className={`rounded-3xl bg-white shadow-sm ${cardPaddingClassNames[padding]}`}
    >
      {children}
    </Component>
  );
};
