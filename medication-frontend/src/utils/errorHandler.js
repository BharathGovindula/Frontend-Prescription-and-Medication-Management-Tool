export function handleError(error) {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) return error.message;
  return 'An unexpected error occurred.';
}

export function logError(error) {
  // Optionally send error to a logging service
  // For now, just log to the console
  console.error(error);
} 