export function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export function getConvexErrorMessage(error: unknown) {
  return toError(error).message;
}

export function isMissingConvexFunctionError(error: unknown) {
  const message = getConvexErrorMessage(error);
  return (
    message.includes("Could not find public function") ||
    message.includes("Could not find function for")
  );
}

export function isUnauthorizedConvexError(error: unknown) {
  const message = getConvexErrorMessage(error);
  return (
    message.includes("Unauthorized") ||
    message.includes("Not authenticated") ||
    message.includes("Authentication")
  );
}

export function isConvexBackendUnavailableError(error: unknown) {
  return isMissingConvexFunctionError(error);
}
