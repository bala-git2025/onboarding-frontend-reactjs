/**
 * Formats a date string into MM/DD/YYYY format.
 * @param dateString - The date string to format (e.g., from an API).
 * @returns The formatted date string (MM/DD/YYYY) or 'N/A' if the input is invalid.
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === "null" || dateString === "") {
    return 'N/A';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Formats a date string into a more readable format (Month Day, Year).
 * @param dateString - The date string to format.
 * @returns The formatted date string or 'N/A' if the input is invalid.
 */
export const formatLongDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === "null" || dateString === "") {
    return 'N/A';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Formats a date string with time.
 * @param dateString - The date string to format.
 * @returns The formatted date string with time or 'N/A' if the input is invalid.
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === "null" || dateString === "") {
    return 'N/A';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  
  return date.toLocaleString();
};