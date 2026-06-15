/* Site password gate helpers.

   The cookie never stores the password — it stores a SHA-256 token derived from
   it, so the plaintext is never exposed to the client. Uses Web Crypto so the
   same code runs in both the edge middleware and the Node route handler. */

export const AUTH_COOKIE = "site_auth";

/** Token stored in the auth cookie when the correct password is entered. */
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
