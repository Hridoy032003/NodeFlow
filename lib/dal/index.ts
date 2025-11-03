/**
 * Data Access Layer (DAL) Index
 * 
 * Centralized export for all database operations.
 * Use these DAL functions instead of direct Prisma calls in API routes.
 */

export { workflowDAL } from './workflows';
export { userDAL } from './users';

// Re-export types
export type { WorkflowWithCounts, WorkflowWithDetails } from './workflows';
