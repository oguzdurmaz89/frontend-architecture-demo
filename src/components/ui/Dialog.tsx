import type { ReactNode } from "react";
import { useEffect, useId } from "react";

type DialogSize = "md" | "lg";

type DialogProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  closeLabel?: string;
  onClose: () => void;
};

const dialogSizeClassNames: Record<DialogSize, string> = {
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Dialog = ({
  title,
  description,
  children,
  footer,
  size = "md",
  closeLabel = "Close dialog",
  onClose,
}: DialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`w-full rounded-2xl bg-white shadow-2xl ${dialogSizeClassNames[size]}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-slate-950">
              {title}
            </h2>

            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
