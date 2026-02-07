/**
 * Shared Database Abstractions
 * 
 * Exports all database-related interfaces and implementations.
 * Provides database-agnostic abstractions using the Repository pattern.
 * 
 * @packageDocumentation
 * @module @colis/rig/shared/database
 */

export * from './repository.js';
export * from './sqlite.js';
export * from './mysql.js';
export * from './postgresql.js';
export * from './factory.js';
export * from './migrations.js';




