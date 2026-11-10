export function Mark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#E7F6FC" />
      <path d="M11 16h10" stroke="#084864" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="11" cy="16" r="3.2" fill="#009CDE" />
      <circle cx="21" cy="16" r="3.2" fill="#084864" />
    </svg>
  );
}
