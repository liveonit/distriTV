import path from "path";
import { TypeOrmMigrationFromFile } from "@utils/dbMigrations/TypeOrmMigrationFromFile";

export class createTableContent1669685518596 extends TypeOrmMigrationFromFile {
  constructor() {
    super(path.resolve(__dirname, 'up.sql'), path.resolve(__dirname, 'down.sql'))
  }
}