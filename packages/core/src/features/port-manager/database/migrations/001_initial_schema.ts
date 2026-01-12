/**
 * Initial Schema Migration
 * 
 * Creates the initial database schema for port assignments.
 */

import { Migration } from '../../../../shared/database/migrations.js';
import { DatabaseRepository } from '../../../../shared/database/repository.js';
import {
  CREATE_PORT_ASSIGNMENTS_TABLE,
  CREATE_PORT_ASSIGNMENTS_INDEXES,
  CREATE_PORT_HISTORY_TABLE,
  CREATE_PORT_HISTORY_INDEXES,
} from '../schema.js';

export const initialSchemaMigration: Migration = {
  version: 1,
  name: 'initial_schema',
  up: async (db: DatabaseRepository) => {
    await db.execute(CREATE_PORT_ASSIGNMENTS_TABLE);
    await db.execute(CREATE_PORT_ASSIGNMENTS_INDEXES);
    await db.execute(CREATE_PORT_HISTORY_TABLE);
    await db.execute(CREATE_PORT_HISTORY_INDEXES);
  },
  down: async (db: DatabaseRepository) => {
    await db.execute('DROP TABLE IF EXISTS port_history');
    await db.execute('DROP TABLE IF EXISTS port_assignments');
  },
};

