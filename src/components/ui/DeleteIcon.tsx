type IconProps = {
  className?: string;
};

export const DeleteIcon = ({ className = "h-4 w-4" }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M5.5 7h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 7V5.75C8 5.34 8.34 5 8.75 5h2.5c.41 0 .75.34.75.75V7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 8.5 7.45 15c.04.56.5 1 1.06 1h2.98c.56 0 1.02-.44 1.06-1L13 8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
