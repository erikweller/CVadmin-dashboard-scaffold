/**
 * Admin authentication utilities for CareVillage admin dashboard
 */

/**
 * Check if an email is in the admin allowlist
 */
export function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || ["cvc@carevillage.io"]
  return adminEmails.includes(email)
}

/**
 * Parse admin emails from environment variable safely
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || ["cvc@carevillage.io"]
  return adminEmails.filter((email) => email.length > 0)
}
