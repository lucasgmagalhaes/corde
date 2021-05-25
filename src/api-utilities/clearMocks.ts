import { runtime } from "../environment";

/**
 * Clear all mocks
 */
export function clearMocks() {
  runtime.resetAllMocks();
}
