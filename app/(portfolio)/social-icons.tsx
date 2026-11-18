/* The social icons, shared by the contact section and the footer. Each draws in the text colour. */

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.7 9.3H4V20h2.7V9.3ZM5.3 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20 20h-2.7v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H10.6V9.3h2.6v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20Z" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.65-.2.65-.46v-1.6c-2.65.58-3.2-1.27-3.2-1.27-.44-1.1-1.06-1.4-1.06-1.4-.87-.6.06-.58.06-.58.96.07 1.46.98 1.46.98.85 1.46 2.23 1.04 2.78.8.09-.62.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.61.97a9.1 9.1 0 0 1 4.76 0c1.81-1.23 2.6-.97 2.6-.97.52 1.31.2 2.28.1 2.52.61.66.98 1.51.98 2.55 0 3.65-2.23 4.46-4.35 4.69.34.3.65.88.65 1.78v2.64c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  );
}
