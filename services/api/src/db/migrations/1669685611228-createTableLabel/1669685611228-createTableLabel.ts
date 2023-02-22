import path from "path";
import { TypeOrmMigrationFromFile } from "@utils/dbMigrations/TypeOrmMigrationFromFile";

export class createTableLabel1669685611220 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}