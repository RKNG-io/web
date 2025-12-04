// PDF filename generation — human-readable names instead of tokens

/**
 * Generate a human-readable PDF filename
 * @example "Sophie-Reckoning-2025-12-04.pdf"
 */
export function generatePDFFilename(
  recipientName: string,
  generatedAt: Date
): string {
  // Clean the name: remove special chars, titlecase, replace spaces with hyphens
  const cleanName = recipientName
    .trim()
    .replace(/[^a-zA-Z\s]/g, '') // Remove non-alpha chars
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-') || 'Client';

  // Format date as YYYY-MM-DD
  const dateStr = generatedAt.toISOString().split('T')[0];

  return `${cleanName}-Reckoning-${dateStr}.pdf`;
}

/**
 * Generate email subject line with first name
 * @example "Sophie, your Reckoning is ready"
 */
export function getEmailSubject(recipientName: string): string {
  const firstName = recipientName.trim().split(/\s+/)[0] || 'there';
  return `${firstName}, your Reckoning is ready`;
}
