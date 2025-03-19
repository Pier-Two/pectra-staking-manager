export const PectraSpinner = () => {
  return (
    <svg
      className="h-6 w-6 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="50%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>
      </defs>

      <path
        d="M4 12a8 8 0 0 1 16 0M12 4a8 8 0 0 1 8 8"
        stroke="url(#gradient)"
      />
    </svg>
  );
};
