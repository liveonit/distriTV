import path from "path";
import { TypeOrmMigrationFromFile } from "lib/dbMigrations/TypeOrmMigrationFromFile";

export class correct_television_constraint1690329230701 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}