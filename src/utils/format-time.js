import { format, formatDistanceToNow, getTime } from 'date-fns';
// Importing functions from the date-fns library for date formatting and manipulation.

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  // Function to format a date to a specified format.

  const fm = newFormat || 'dd MMM yyyy';
  // Default format is 'dd MMM yyyy' if no format is provided.

  return date ? format(new Date(date), fm) : '';
  // If date is provided, format it using the specified or default format.
  // If no date is provided, return an empty string.
}

export function fDateTime(date, newFormat) {
  // Function to format a date and time to a specified format.

  const fm = newFormat || 'dd MMM yyyy p';
  // Default format is 'dd MMM yyyy p' if no format is provided.

  return date ? format(new Date(date), fm) : '';
  // If date is provided, format it using the specified or default format.
  // If no date is provided, return an empty string.
}

export function fTimestamp(date) {
  // Function to get the timestamp of a date.

  return date ? getTime(new Date(date)) : '';
  // If date is provided, get the timestamp.
  // If no date is provided, return an empty string.
}

export function fToNow(date) {
  // Function to get the distance to now from a given date.

  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
  // If date is provided, format the distance to now with a suffix.
  // If no date is provided, return an empty string.
}
