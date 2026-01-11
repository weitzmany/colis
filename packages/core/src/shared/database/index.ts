/**
 * Shared Database Abstractions
 * 
 * Exports all database-related interfaces and implementations.
 * Provides database-agnostic abstractions using the Repository pattern.
 * 
 * @packageDocumentation
 * @module @your-org/core/shared/database
 */

export * from './repository';
export * from './sqlite';
export * from './mysql';
export * from './postgresql';
export * from './factory';
export * from './migrations';




