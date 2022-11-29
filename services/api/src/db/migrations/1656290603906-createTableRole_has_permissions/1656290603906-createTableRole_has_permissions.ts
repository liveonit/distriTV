import path from 'path';
import { TypeOrmMigrationFromFile } from '@utils/dbMigrations/TypeOrmMigrationFromFile';

export class createTableRole_has_permissions1656290603906 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'));
  }
}
