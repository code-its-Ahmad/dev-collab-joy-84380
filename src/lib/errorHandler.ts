import { toast } from "sonner";

/**
 * Maps database error codes to user-friendly messages
 * This prevents exposing internal database structure to users
 */
const ERROR_MESSAGES: Record<string, string> = {
  // PostgreSQL constraint violations
  '23505': 'This item already exists',
  '23503': 'Related data not found',
  '23514': 'Invalid data provided',
  
  // Supabase/PostgREST errors
  'PGRST116': 'Access denied',
  '42501': 'Permission denied',
  '42P01': 'Resource not found',
  
  // Auth errors
  'auth/invalid-email': 'Invalid email address',
  'auth/user-not-found': 'User not found',
  'auth/wrong-password': 'Incorrect password',
};

/**
 * Handles errors securely by:
 * 1. Logging full error details to console (for debugging)
 * 2. Showing user-friendly message to users (security)
 * 3. Never exposing database schema or internal details
 */
export function handleError(error: any, context: string): void {
  // Log full error for debugging (only visible in browser console, not to end users)
  console.error(`${context} error:`, error);
  
  // Determine user-friendly message
  const errorCode = error?.code || error?.error_code;
  const userMessage = ERROR_MESSAGES[errorCode] || 'An error occurred. Please try again.';
  
  // Show safe message to user
  toast.error(userMessage);
}

/**
 * Handles errors and re-throws for cases where the caller needs to handle it
 */
export function handleErrorAndThrow(error: any, context: string): never {
  handleError(error, context);
  throw error;
}
