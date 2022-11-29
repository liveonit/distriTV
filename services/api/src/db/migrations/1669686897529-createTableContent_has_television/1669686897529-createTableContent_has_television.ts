import path from "path";
import { TypeOrmMigrationFromFile } from "@utils/dbMigrations/TypeOrmMigrationFromFile";

export class createTableContent_has_Television1669686897515 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}