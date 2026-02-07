/**
 * Port Manager Error Classes Tests
 */

import {
  PortManagerError,
  PortConflictError,
  PortRangeExhaustedError,
  PortInUseError,
  PortAssignmentNotFoundError,
} from '../errors.js';

describe('Port Manager Error Classes', () => {
  describe('PortManagerError', () => {
    it('should create error with message and code', () => {
      const error = new PortManagerError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('PortManagerError');
    });

    it('should include details when provided', () => {
      const details = { port: 3000, projectName: 'test' };
      const error = new PortManagerError('Test error', 'TEST_CODE', details);
      expect(error.details).toEqual(details);
    });
  });

  describe('PortConflictError', () => {
    it('should create error with port and project name', () => {
      const error = new PortConflictError(
        'Port conflict',
        3000,
        'test-project',
        'assigned'
      );
      expect(error.message).toBe('Port conflict');
      expect(error.code).toBe('PORT_CONFLICT');
      expect(error.port).toBe(3000);
      expect(error.projectName).toBe('test-project');
      expect(error.conflictType).toBe('assigned');
      expect(error.name).toBe('PortConflictError');
    });

    it('should be instance of PortManagerError', () => {
      const error = new PortConflictError('Test', 3000);
      expect(error).toBeInstanceOf(PortManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('PortRangeExhaustedError', () => {
    it('should create error with app type and range', () => {
      const range = { start: 3001, end: 3099 };
      const error = new PortRangeExhaustedError(
        'Range exhausted',
        'nextjs',
        range
      );
      expect(error.message).toBe('Range exhausted');
      expect(error.code).toBe('PORT_RANGE_EXHAUSTED');
      expect(error.appType).toBe('nextjs');
      expect(error.range).toEqual(range);
      expect(error.name).toBe('PortRangeExhaustedError');
    });

    it('should be instance of PortManagerError', () => {
      const error = new PortRangeExhaustedError('Test', 'node');
      expect(error).toBeInstanceOf(PortManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('PortInUseError', () => {
    it('should create error with port number', () => {
      const error = new PortInUseError('Port in use', 3000);
      expect(error.message).toBe('Port in use');
      expect(error.code).toBe('PORT_IN_USE');
      expect(error.port).toBe(3000);
      expect(error.name).toBe('PortInUseError');
    });

    it('should be instance of PortManagerError', () => {
      const error = new PortInUseError('Test', 3000);
      expect(error).toBeInstanceOf(PortManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('PortAssignmentNotFoundError', () => {
    it('should create error with project name and app type', () => {
      const error = new PortAssignmentNotFoundError(
        'Assignment not found',
        'test-project',
        'nextjs'
      );
      expect(error.message).toBe('Assignment not found');
      expect(error.code).toBe('PORT_ASSIGNMENT_NOT_FOUND');
      expect(error.projectName).toBe('test-project');
      expect(error.appType).toBe('nextjs');
      expect(error.name).toBe('PortAssignmentNotFoundError');
    });

    it('should be instance of PortManagerError', () => {
      const error = new PortAssignmentNotFoundError('Test', 'project', 'node');
      expect(error).toBeInstanceOf(PortManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
