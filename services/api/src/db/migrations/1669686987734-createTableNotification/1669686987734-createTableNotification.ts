import path from "path";
import { TypeOrmMigrationFromFile } from "lib/dbMigrations/TypeOrmMigrationFromFile";

export class createTableNotification1669686987729 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}
