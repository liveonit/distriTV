import path from "path";
import { TypeOrmMigrationFromFile } from "@lib/dbMigrations/TypeOrmMigrationFromFile";

export class createTableInstitution1656290637752 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}
