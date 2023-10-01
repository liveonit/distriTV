import path from "path";
import { TypeOrmMigrationFromFile } from "lib/dbMigrations/TypeOrmMigrationFromFile";

export class createTableLabel1669684793934 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}
