/* ============================================================================
   Contact details — single source of truth.
   Used by the ContactCard and to detect contact intent in chat answers.
   ========================================================================== */

export const EMAIL = "csswillbox@gmail.com";
export const LINKEDIN_HANDLE = "williamjbox";
export const LINKEDIN_URL = `https://www.linkedin.com/in/${LINKEDIN_HANDLE}`;
export const GITHUB_HANDLE = "whoiswillbox";
export const GITHUB_URL = `https://github.com/${GITHUB_HANDLE}`;
export const SITE_DOMAIN = "whoiswillbox.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
/** Not a contact channel — used for the stunt-double easter egg answer only. */
export const IMDB_URL = "https://www.imdb.com/name/nm7973436/";

/**
 * Marker an answer can include to request the ContactCard without listing the
 * raw details itself. Stripped from the text before display. Keeps contact
 * answers short — the card carries the actual handles.
 */
export const CONTACT_MARKER = "[[contact]]";

/**
 * True when a chat answer should surface the ContactCard — either via the
 * explicit marker, or (fallback) because it names the contact details directly.
 */
export function showContactCard(text: string): boolean {
  if (text.includes(CONTACT_MARKER)) return true;
  const t = text.toLowerCase();
  return (
    t.includes("linkedin") ||
    t.includes(EMAIL.toLowerCase()) ||
    t.includes(SITE_DOMAIN)
  );
}

/** Remove the contact marker (and tidy whitespace) for display. */
export function stripContactMarker(text: string): string {
  return text.replace(CONTACT_MARKER, "").replace(/\s+/g, " ").trim();
}

/**
 * Marker an answer can include to request the IMDbCard (the stunt-double
 * easter egg) without typing out the raw URL — same pattern as CONTACT_MARKER.
 */
export const IMDB_MARKER = "[[imdb]]";

export function showImdbCard(text: string): boolean {
  return text.includes(IMDB_MARKER);
}

/** Remove the IMDb marker (and tidy whitespace) for display. */
export function stripImdbMarker(text: string): string {
  return text.replace(IMDB_MARKER, "").replace(/\s+/g, " ").trim();
}
