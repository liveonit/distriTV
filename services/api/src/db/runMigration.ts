import { logger } from 'lib';
import {createMigration} from 'lib/dbMigrations/createMigration'
import { db } from '.';

if (require.main === module) {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  if (!args[0] || (args[0] !== 'migration' && args[0] !== 'seed') || !args[1])
    logger.error(`Invalid params, migration or seed should include 'type' and 'name'.
  Ex: npx ts-node lib/dbMigrations/createMigration.ts <type> <name>
  Args:
    type: possible values 'migrations' or 'seed'
    name: the name of your migration. Ex: 'CreateUserTable'
  `);
  createMigration(db, args[1], args[0]);
}
