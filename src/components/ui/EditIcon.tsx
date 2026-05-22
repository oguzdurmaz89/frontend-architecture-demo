type IconProps = {
  className?: string;
};

export const EditIcon = ({ className = "h-4 w-4" }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M4 13.75V16h2.25L14.4 7.85 12.15 5.6 4 13.75Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 6.25 12.7 5.05a1.2 1.2 0 0 1 1.7 0l.55.55a1.2 1.2 0 0 1 0 1.7l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
