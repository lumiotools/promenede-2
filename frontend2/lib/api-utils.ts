// Helper functions for API calls

/**
 * Handles API errors and returns a standardized error response
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "An error occurred"
) {
  console.error("API error:", error);

  const errorMessage = error instanceof Error ? error.message : defaultMessage;

  return {
    error: errorMessage,
  };
}

/**
 * Validates required query parameters
 */
export function validateQueryParams(
  params: Record<string, string | null>,
  requiredParams: string[]
) {
  const missingParams = requiredParams.filter((param) => !params[param]);

  if (missingParams.length > 0) {
    return {
      valid: false,
      error: `Missing required parameters: ${missingParams.join(", ")}`,
    };
  }

  return { valid: true };
}
