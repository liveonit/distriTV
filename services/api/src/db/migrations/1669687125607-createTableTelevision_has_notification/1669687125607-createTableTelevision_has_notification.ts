import path from "path";
import { TypeOrmMigrationFromFile } from "lib/dbMigrations/TypeOrmMigrationFromFile";

export class createTableTelevision_has_notification1669687125594 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}
