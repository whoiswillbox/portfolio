/* Site password gate helpers.

   The cookie never stores the password — it stores a SHA-256 token derived from
   it, so the plaintext is never exposed to the client. Uses Web Crypto so the
   same code runs in both the edge middleware and the Node route handler. */

export const AUTH_COOKIE = "site_auth";
export const ADMIN_COOKIE = "admin_auth";

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token stored in the site-gate cookie when the correct password is entered. */
export async function authToken(password: string): Promise<string> {
  return sha256hex(`v1:${password}`);
}

/** Token stored in the admin cookie when the correct ADMIN_KEY is entered. */
export async function adminToken(key: string): Promise<string> {
  return sha256hex(`admin:${key}`);
}
