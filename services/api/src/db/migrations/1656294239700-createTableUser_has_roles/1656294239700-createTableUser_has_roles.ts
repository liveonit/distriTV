import path from 'path';
import { TypeOrmMigrationFromFile } from '@lib/dbMigrations/TypeOrmMigrationFromFile';

export class createTableUser_has_roles1656294239700 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'));
  }
}
