/**
 * Port Manager Custom Errors
 * 
 * Custom error classes for Port Manager operations.
 */

/**
 * Base error class for Port Manager errors
 */
export class PortManagerError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'PortManagerError';
    Object.setPrototypeOf(this, PortManagerError.prototype);
  }
}

/**
 * Error thrown when a port conflict is detected
 */
export class PortConflictError extends PortManagerError {
  constructor(
    message: string,
    public port?: number,
    public projectName?: string,
    public conflictType?: string
  ) {
    super(message, 'PORT_CONFLICT', { port, projectName, conflictType });
    this.name = 'PortConflictError';
    Object.setPrototypeOf(this, PortConflictError.prototype);
  }
}

/**
 * Error thrown when port range is exhausted
 */
export class PortRangeExhaustedError extends PortManagerError {
  constructor(
    message: string,
    public appType?: string,
    public range?: { start: number; end: number }
  ) {
    super(message, 'PORT_RANGE_EXHAUSTED', { appType, range });
    this.name = 'PortRangeExhaustedError';
    Object.setPrototypeOf(this, PortRangeExhaustedError.prototype);
  }
}

/**
 * Error thrown when port is already in use on the system
 */
export class PortInUseError extends PortManagerError {
  constructor(
    message: string,
    public port: number
  ) {
    super(message, 'PORT_IN_USE', { port });
    this.name = 'PortInUseError';
    Object.setPrototypeOf(this, PortInUseError.prototype);
  }
}

/**
 * Error thrown when port assignment is not found
 */
export class PortAssignmentNotFoundError extends PortManagerError {
  constructor(
    message: string,
    public projectName?: string,
    public appType?: string
  ) {
    super(message, 'PORT_ASSIGNMENT_NOT_FOUND', { projectName, appType });
    this.name = 'PortAssignmentNotFoundError';
    Object.setPrototypeOf(this, PortAssignmentNotFoundError.prototype);
  }
}
